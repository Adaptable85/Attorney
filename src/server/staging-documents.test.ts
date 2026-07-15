import { afterEach, describe, expect, it, vi } from "vitest";

import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import {
  getStagingClientDocumentContent,
  getStagingMatterDocumentContent,
  loadClientDocuments,
  loadMatterDocuments,
  listClientDocuments,
  listMatterDocuments,
  maxStagingDocumentUploadBytes,
  parseDocumentUploadFormData,
  parseMatterDocumentUploadFormData,
  suggestClientGeneralDocumentFilename,
  suggestDocumentFilename,
  uploadStagingClientDocument,
  uploadStagingMatterDocument
} from "./staging-documents";

const stagingPrincipal: AuthenticatedPrincipal = {
  userId: "staging_admin_password_reviewer",
  email: "staging.admin.review@example.test",
  roles: ["READ_ONLY_REVIEWER"],
  provider: "staging_admin_password"
};

function createTestFile(size = 12) {
  return new File(["x".repeat(size)], "test-document.txt", {
    type: "text/plain"
  });
}

function createUntypedTestFile(size = 12) {
  return new File(["x".repeat(size)], "test-document", {
    type: ""
  });
}

function createFakePrisma() {
  const clients = [{ id: "client_1", displayName: "TEST Client" }];
  const matters = [{
    id: "matter_1",
    clientId: "client_1",
    accountNumber: "TEST-MATTER-001",
    name: "TEST Matter",
    client: {
      id: "client_1",
      displayName: "TEST Client"
    }
  }];
  const documents: Array<{
    id: string;
    clientId?: string;
    matterId?: string;
    filename: string;
    contentType: string;
    sizeBytes: number;
    status: "ACTIVE";
    createdAt: Date;
  }> = [];
  const documentContents: unknown[] = [];
  const auditLogs: unknown[] = [];
  const timelineEvents: unknown[] = [];

  const tx = {
    user: {
      async upsert() {
        return { id: "staging_admin_password_reviewer" };
      }
    },
    client: {
      async findUnique({ where }: { where: { id: string } }) {
        return clients.find((client) => client.id === where.id) ?? null;
      }
    },
    matter: {
      async findUnique({ where }: { where: { id: string } }) {
        return matters.find((matter) => matter.id === where.id) ?? null;
      }
    },
    documentRecord: {
      async create({ data }: { data: {
        clientId?: string;
        matterId?: string;
        filename: string;
        contentType: string;
        sizeBytes: number;
      } }) {
        const record = {
          id: `document_${documents.length + 1}`,
          clientId: data.clientId,
          matterId: data.matterId,
          filename: data.filename,
          contentType: data.contentType,
          sizeBytes: data.sizeBytes,
          status: "ACTIVE" as const,
          createdAt: new Date("2026-07-15T09:00:00.000Z")
        };
        documents.push(record);
        return record;
      },
      async findUnique({ where }: { where: { id: string } }) {
        const document = documents.find((record) => record.id === where.id);

        if (!document) {
          return null;
        }

        return {
          ...document,
          clientId: document.clientId ?? "client_1",
          matterId: document.matterId ?? null,
          content: {
            bytes: new Uint8Array([116, 101, 115, 116]),
            sizeBytes: 4
          }
        };
      },
      async findMany({ where }: { where?: { clientId?: string; matterId?: string } } = {}) {
        return documents.filter((document) => {
          if (where?.clientId && document.clientId !== where.clientId) {
            return false;
          }

          if (where?.matterId && document.matterId !== where.matterId) {
            return false;
          }

          return true;
        });
      }
    },
    documentContent: {
      async create({ data }: { data: unknown }) {
        documentContents.push(data);
        return data;
      }
    },
    auditLog: {
      async create({ data }: { data: unknown }) {
        auditLogs.push(data);
        return data;
      }
    },
    timelineEvent: {
      async create({ data }: { data: unknown }) {
        timelineEvents.push(data);
        return data;
      }
    }
  };

  return {
    documents,
    matters,
    documentContents,
    auditLogs,
    timelineEvents,
    prisma: {
      ...tx,
      async $transaction<T>(work: (scope: typeof tx) => Promise<T>) {
        return work(tx);
      }
    }
  };
}

describe("staging documents", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.burgessPrismaClient = undefined;
  });

  it("suggests guided document filenames", () => {
    expect(
      suggestDocumentFilename({
        clientName: "TEST Client File",
        matterReference: "General Matter",
        documentType: "Identity Document",
        documentDate: "2026-07-15"
      })
    ).toBe("TEST_Client_File_General_Matter_Identity_Document_2026_07_15");
  });

  it("suggests guided client general document filenames without matter names", () => {
    expect(
      suggestClientGeneralDocumentFilename({
        clientName: "TEST Client File",
        documentType: "Proof of address",
        documentDate: "2026-07-15"
      })
    ).toBe("TEST_Client_File_Proof_of_address_2026_07_15");
  });

  it("omits blank parts from guided client general document filenames", () => {
    expect(
      suggestClientGeneralDocumentFilename({
        clientName: "TEST Client File",
        documentType: " / ",
        documentDate: "2026-07-15"
      })
    ).toBe("TEST_Client_File_2026_07_15");
  });

  it("parses upload metadata and file", () => {
    const formData = new FormData();
    formData.set("clientId", "client_1");
    formData.set("documentType", "Identity");
    formData.set("matterReference", "General");
    formData.set("documentDate", "2026-07-15");
    formData.set("displayFilename", "TEST_Client_General_Identity_2026_07_15.txt");
    formData.set("file", createTestFile());

    expect(parseDocumentUploadFormData(formData)).toMatchObject({
      metadata: {
        clientId: "client_1",
        documentType: "Identity"
      },
      file: expect.any(File)
    });
  });

  it("parses matter upload metadata and file", () => {
    const formData = new FormData();
    formData.set("clientId", "client_1");
    formData.set("matterId", "matter_1");
    formData.set("documentType", "Notice");
    formData.set("matterReference", "TEST-MATTER-001");
    formData.set("documentDate", "2026-07-15");
    formData.set("displayFilename", "TEST_Matter_Notice_2026_07_15.txt");
    formData.set("file", createTestFile());

    expect(parseMatterDocumentUploadFormData(formData)).toMatchObject({
      metadata: {
        clientId: "client_1",
        matterId: "matter_1",
        documentType: "Notice"
      },
      file: expect.any(File)
    });
  });

  it("fails closed when document uploads are disabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await uploadStagingClientDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        documentType: "Identity",
        matterReference: "General",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Client_General_Identity_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "false"
      }
    });

    expect(result.ok).toBe(false);
    expect(fake.documents).toHaveLength(0);
  });

  it("fails closed when DATABASE_URL is missing", async () => {
    const fake = createFakePrisma();

    const result = await uploadStagingClientDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        documentType: "Identity",
        matterReference: "General",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Client_General_Identity_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
  });

  it("validates required file and filename", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await uploadStagingClientDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        documentType: "Identity",
        matterReference: "General",
        documentDate: "2026-07-15",
        displayFilename: "../bad"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });

  it("validates required document metadata", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await uploadStagingClientDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        documentType: "",
        matterReference: "General",
        documentDate: "not-a-date",
        displayFilename: "TEST_Client_General_Identity_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });

  it("validates missing and oversized files", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    const metadata = {
      clientId: "client_1",
      documentType: "Identity",
      matterReference: "General",
      documentDate: "2026-07-15",
      displayFilename: "TEST_Client_General_Identity_2026_07_15.txt"
    };

    await expect(
      uploadStagingClientDocument({
        principal: stagingPrincipal,
        prisma: fake.prisma,
        metadata,
        file: null,
        environment: {
          BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
        }
      })
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
    await expect(
      uploadStagingClientDocument({
        principal: stagingPrincipal,
        prisma: fake.prisma,
        metadata,
        file: createTestFile(maxStagingDocumentUploadBytes + 1),
        environment: {
          BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
        }
      })
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });

  it("returns not found when the client file is missing", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await uploadStagingClientDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "missing_client",
        documentType: "Identity",
        matterReference: "General",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Client_General_Identity_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("creates document metadata, content, audit and timeline records when enabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await uploadStagingClientDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        documentType: "Identity",
        matterReference: "General",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Client_General_Identity_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        filename: "TEST_Client_General_Identity_2026_07_15.txt"
      }
    });
    expect(fake.documents).toHaveLength(1);
    expect(fake.documentContents).toHaveLength(1);
    expect(fake.auditLogs).toHaveLength(1);
    expect(fake.timelineEvents).toHaveLength(1);
  });

  it("creates matter document metadata, content, audit and timeline records when enabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await uploadStagingMatterDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        matterId: "matter_1",
        documentType: "Notice",
        matterReference: "TEST-MATTER-001",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Matter_Notice_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        filename: "TEST_Matter_Notice_2026_07_15.txt"
      }
    });
    expect(fake.documents).toMatchObject([
      {
        clientId: "client_1",
        matterId: "matter_1"
      }
    ]);
    expect(fake.documentContents).toHaveLength(1);
    expect(fake.auditLogs).toHaveLength(1);
    expect(fake.timelineEvents).toHaveLength(1);
  });

  it("returns not found when uploading to a missing matter", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await uploadStagingMatterDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        matterId: "missing_matter",
        documentType: "Notice",
        matterReference: "TEST-MATTER-001",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Matter_Notice_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("fails closed when matter document upload has no database URL", async () => {
    const fake = createFakePrisma();

    const result = await uploadStagingMatterDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        matterId: "matter_1",
        documentType: "Notice",
        matterReference: "TEST-MATTER-001",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Matter_Notice_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
  });

  it("fails closed when matter document uploads are disabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await uploadStagingMatterDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        matterId: "matter_1",
        documentType: "Notice",
        matterReference: "TEST-MATTER-001",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Matter_Notice_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "false"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "UNAUTHORIZED"
      }
    });
  });

  it("validates matter document metadata, file and safe filename", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    const base = {
      clientId: "client_1",
      matterId: "matter_1",
      documentType: "Notice",
      matterReference: "TEST-MATTER-001",
      documentDate: "2026-07-15",
      displayFilename: "TEST_Matter_Notice_2026_07_15.txt"
    };

    await expect(uploadStagingMatterDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        ...base,
        documentDate: "not-a-date"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    })).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
    await expect(uploadStagingMatterDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        ...base,
        displayFilename: "bad/name"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    })).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
    await expect(uploadStagingMatterDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: base,
      file: null,
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    })).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
    await expect(uploadStagingMatterDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: base,
      file: createTestFile(maxStagingDocumentUploadBytes + 1),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    })).resolves.toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });

  it("returns transaction failure when matter document upload cannot commit", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    const result = await uploadStagingMatterDocument({
      principal: stagingPrincipal,
      prisma: {
        async $transaction() {
          throw new Error("transaction failed");
        }
      },
      metadata: {
        clientId: "client_1",
        matterId: "matter_1",
        documentType: "Notice",
        matterReference: "TEST-MATTER-001",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Matter_Notice_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });

  it("loads document content for inline view and records access audit", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
      clientId: "client_1",
      filename: "TEST.txt",
      contentType: "text/plain",
      sizeBytes: 4,
      status: "ACTIVE",
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });

    const result = await getStagingClientDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      clientId: "client_1",
      documentId: "document_1",
      action: "view",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        filename: "TEST.txt",
        contentType: "text/plain",
        sizeBytes: 4
      }
    });
    expect(fake.auditLogs).toHaveLength(1);
  });

  it("loads document content for download and records a download audit", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
      clientId: "client_1",
      filename: "TEST.txt",
      contentType: "text/plain",
      sizeBytes: 4,
      status: "ACTIVE",
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });

    const result = await getStagingClientDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      clientId: "client_1",
      documentId: "document_1",
      action: "download",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result.ok).toBe(true);
    expect(fake.auditLogs).toEqual([
      expect.objectContaining({
        eventType: "DOCUMENT_DOWNLOADED"
      })
    ]);
  });

  it("loads matter document content for view and download", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
      clientId: "client_1",
      matterId: "matter_1",
      filename: "TEST.txt",
      contentType: "text/plain",
      sizeBytes: 4,
      status: "ACTIVE",
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });

    await expect(getStagingMatterDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "matter_1",
      documentId: "document_1",
      action: "view",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    })).resolves.toMatchObject({
      ok: true,
      data: {
        filename: "TEST.txt"
      }
    });
    await expect(getStagingMatterDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "matter_1",
      documentId: "document_1",
      action: "download",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    })).resolves.toMatchObject({
      ok: true,
      data: {
        filename: "TEST.txt"
      }
    });
    expect(fake.auditLogs).toHaveLength(2);
  });

  it("fails closed when matter document access has no database URL", async () => {
    const fake = createFakePrisma();

    const result = await getStagingMatterDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "matter_1",
      documentId: "document_1",
      action: "view",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
  });

  it("fails closed when matter document access is disabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await getStagingMatterDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "matter_1",
      documentId: "document_1",
      action: "view",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "false"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "UNAUTHORIZED"
      }
    });
  });

  it("fails closed when document access has no database URL", async () => {
    const fake = createFakePrisma();

    const result = await getStagingClientDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      clientId: "client_1",
      documentId: "document_1",
      action: "view",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
  });

  it("fails closed when document access gate is disabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await getStagingClientDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      clientId: "client_1",
      documentId: "document_1",
      action: "view",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "false"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "UNAUTHORIZED"
      }
    });
  });

  it("fails closed when document content does not belong to the client", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
      clientId: "client_2",
      filename: "TEST.txt",
      contentType: "text/plain",
      sizeBytes: 4,
      status: "ACTIVE",
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });

    const result = await getStagingClientDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      clientId: "client_1",
      documentId: "document_1",
      action: "download",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("fails closed when document content does not belong to the matter", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
      clientId: "client_1",
      matterId: "matter_2",
      filename: "TEST.txt",
      contentType: "text/plain",
      sizeBytes: 4,
      status: "ACTIVE",
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });

    const result = await getStagingMatterDocumentContent({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "matter_1",
      documentId: "document_1",
      action: "download",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("returns transaction failure when matter document content cannot be loaded", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    const result = await getStagingMatterDocumentContent({
      principal: stagingPrincipal,
      prisma: {
        async $transaction() {
          throw new Error("transaction failed");
        }
      },
      matterId: "matter_1",
      documentId: "document_1",
      action: "view",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });

  it("returns transaction failure when document content cannot be loaded", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    const result = await getStagingClientDocumentContent({
      principal: stagingPrincipal,
      prisma: {
        async $transaction() {
          throw new Error("transaction failed");
        }
      },
      clientId: "client_1",
      documentId: "document_1",
      action: "view",
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });

  it("uses safe defaults for optional upload metadata", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await uploadStagingClientDocument({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      metadata: {
        clientId: "client_1",
        documentType: "Identity",
        matterReference: "",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Client_General_Identity_2026_07_15.txt"
      },
      file: createUntypedTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result.ok).toBe(true);
    expect(fake.documents[0]?.contentType).toBe("application/octet-stream");
  });

  it("lists uploaded client documents", async () => {
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
      clientId: "client_1",
      filename: "TEST.txt",
      contentType: "text/plain",
      sizeBytes: 12,
      status: "ACTIVE",
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });

    const result = await listClientDocuments({
      prisma: fake.prisma,
      clientId: "client_1"
    });

    expect(result).toMatchObject({
      ok: true,
      data: [
        {
          filename: "TEST.txt"
        }
      ]
    });
  });

  it("lists uploaded matter documents", async () => {
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
      clientId: "client_1",
      matterId: "matter_1",
      filename: "TEST.txt",
      contentType: "text/plain",
      sizeBytes: 12,
      status: "ACTIVE",
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });

    const result = await listMatterDocuments({
      prisma: fake.prisma,
      matterId: "matter_1"
    });

    expect(result).toMatchObject({
      ok: true,
      data: [
        {
          filename: "TEST.txt"
        }
      ]
    });
  });

  it("returns repository failure when matter documents cannot be listed", async () => {
    const result = await listMatterDocuments({
      prisma: {
        documentRecord: {
          async findMany() {
            throw new Error("database unavailable");
          }
        }
      },
      matterId: "matter_1"
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR"
      }
    });
  });

  it("returns repository failure when client documents cannot be listed", async () => {
    const result = await listClientDocuments({
      prisma: {
        documentRecord: {
          async findMany() {
            throw new Error("database unavailable");
          }
        }
      },
      clientId: "client_1"
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR"
      }
    });
  });

  it("returns transaction failure when document upload cannot commit", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    const result = await uploadStagingClientDocument({
      principal: stagingPrincipal,
      prisma: {
        async $transaction() {
          throw new Error("transaction failed");
        }
      },
      metadata: {
        clientId: "client_1",
        documentType: "Identity",
        matterReference: "General",
        documentDate: "2026-07-15",
        displayFilename: "TEST_Client_General_Identity_2026_07_15.txt"
      },
      file: createTestFile(),
      environment: {
        BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });

  it("returns empty documents when DATABASE_URL is unavailable", async () => {
    await expect(loadClientDocuments("client_1")).resolves.toEqual([]);
  });

  it("returns empty matter documents when DATABASE_URL is unavailable", async () => {
    await expect(loadMatterDocuments("matter_1")).resolves.toEqual([]);
  });

  it("loads documents through the configured Prisma client", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
      clientId: "client_1",
      filename: "TEST.txt",
      contentType: "text/plain",
      sizeBytes: 12,
      status: "ACTIVE",
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });
    globalThis.burgessPrismaClient = fake.prisma as never;

    await expect(loadClientDocuments("client_1")).resolves.toMatchObject([
      {
        filename: "TEST.txt"
      }
    ]);
  });

  it("loads matter documents through the configured Prisma client", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
      clientId: "client_1",
      matterId: "matter_1",
      filename: "TEST.txt",
      contentType: "text/plain",
      sizeBytes: 12,
      status: "ACTIVE",
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });
    globalThis.burgessPrismaClient = fake.prisma as never;

    await expect(loadMatterDocuments("matter_1")).resolves.toMatchObject([
      {
        filename: "TEST.txt"
      }
    ]);
  });

  it("returns empty documents when the configured Prisma client fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      documentRecord: {
        async findMany() {
          throw new Error("database unavailable");
        }
      }
    } as never;

    await expect(loadClientDocuments("client_1")).resolves.toEqual([]);
  });
});
