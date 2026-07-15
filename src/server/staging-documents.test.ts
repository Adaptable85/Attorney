import { afterEach, describe, expect, it, vi } from "vitest";

import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import {
  loadClientDocuments,
  listClientDocuments,
  maxStagingDocumentUploadBytes,
  parseDocumentUploadFormData,
  suggestDocumentFilename,
  uploadStagingClientDocument
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
  const documents: Array<{
    id: string;
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
    documentRecord: {
      async create({ data }: { data: {
        filename: string;
        contentType: string;
        sizeBytes: number;
      } }) {
        const record = {
          id: `document_${documents.length + 1}`,
          filename: data.filename,
          contentType: data.contentType,
          sizeBytes: data.sizeBytes,
          status: "ACTIVE" as const,
          createdAt: new Date("2026-07-15T09:00:00.000Z")
        };
        documents.push(record);
        return record;
      },
      async findMany() {
        return documents;
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

  it("loads documents through the configured Prisma client", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.documents.push({
      id: "document_1",
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
