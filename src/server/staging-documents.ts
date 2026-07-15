import { createHash } from "node:crypto";

import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { evaluateStagingDocumentUploadGate } from "@/config/staging-admin-live-gates";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  type ServiceResult,
  repositoryFailure,
  serviceFailure,
  serviceSuccess,
  transactionFailure
} from "@/services/service-result";
import { ZodError, z } from "zod";

export const maxStagingDocumentUploadBytes = 10 * 1024 * 1024;

export type ClientDocumentListItem = {
  id: string;
  filename: string;
  documentType: string;
  matterReference: string | null;
  documentDate: string | null;
  contentType: string;
  sizeBytes: number | null;
  status: "ACTIVE" | "SUPERSEDED" | "ARCHIVED";
  createdAt: Date;
};

export type MatterDocumentListItem = ClientDocumentListItem;

export type StagingDocumentUploadResult = {
  id: string;
  filename: string;
};

export type StagingDocumentContentResult = {
  id: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  bytes: Uint8Array;
};

const uploadMetadataSchema = z.object({
  clientId: z.string().trim().min(1, "Client file is required"),
  documentType: z.string().trim().min(1, "Document type is required").max(80),
  matterReference: z.string().trim().max(120).optional(),
  documentDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Document date must use YYYY-MM-DD"),
  displayFilename: z.string().trim().min(1, "Display filename is required").max(180)
});

const matterUploadMetadataSchema = uploadMetadataSchema.extend({
  matterId: z.string().trim().min(1, "Matter is required")
});

type ValidatedUploadMetadata = z.output<typeof uploadMetadataSchema>;
type ValidatedMatterUploadMetadata = z.output<typeof matterUploadMetadataSchema>;

type PrismaDocumentRecord = {
  id: string;
  filename: string;
  contentType: string;
  sizeBytes: number | null;
  status: "ACTIVE" | "SUPERSEDED" | "ARCHIVED";
  createdAt: Date;
};

type DocumentTransaction = {
  user: {
    upsert(args: {
      where: { id: string };
      update: {
        email: string;
        name: string;
        status: "ACTIVE";
        authProvider: "FUTURE_PROVIDER";
      };
      create: {
        id: string;
        email: string;
        name: string;
        status: "ACTIVE";
        authProvider: "FUTURE_PROVIDER";
      };
    }): Promise<{ id: string }>;
  };
  client: {
    findUnique(args: {
      where: { id: string };
      select: {
        id: true;
        displayName: true;
      };
    }): Promise<{ id: string; displayName: string } | null>;
  };
  matter: {
    findUnique(args: {
      where: { id: string };
      select: {
        id: true;
        clientId: true;
        accountNumber: true;
        name: true;
        client: {
          select: {
            id: true;
            displayName: true;
          };
        };
      };
    }): Promise<{
      id: string;
      clientId: string;
      accountNumber: string;
      name: string;
      client: {
        id: string;
        displayName: string;
      };
    } | null>;
  };
  documentRecord: {
    create(args: {
      data: {
        clientId: string;
        matterId?: string;
        storageKey: string;
        filename: string;
        contentType: string;
        sizeBytes: number;
        visibility: "PRIVATE";
        status: "ACTIVE";
        uploadedById: string;
      };
    }): Promise<PrismaDocumentRecord>;
    findMany(args: {
      where: {
        clientId?: string;
        matterId?: string;
        status: { not: "ARCHIVED" };
      };
      orderBy: [{ createdAt: "desc" }, { id: "asc" }];
    }): Promise<PrismaDocumentRecord[]>;
    findUnique(args: {
      where: { id: string };
      include: {
        content: {
          select: {
            bytes: true;
            sizeBytes: true;
          };
        };
      };
    }): Promise<(PrismaDocumentRecord & {
      clientId: string | null;
      matterId: string | null;
      content: {
        bytes: Uint8Array;
        sizeBytes: number;
      } | null;
    }) | null>;
  };
  documentContent: {
    create(args: {
      data: {
        documentId: string;
        bytes: Uint8Array;
        sha256: string;
        sizeBytes: number;
      };
    }): Promise<unknown>;
  };
  auditLog: {
    create(args: {
      data: {
        eventType: "DOCUMENT_UPLOADED" | "DOCUMENT_ACCESSED" | "DOCUMENT_DOWNLOADED";
        actorId: string;
        targetType: "document";
        targetId: string;
        summary: string;
        metadata: Record<string, unknown>;
        sensitive: true;
      };
    }): Promise<unknown>;
  };
  timelineEvent: {
    create(args: {
      data: {
        eventType: "DOCUMENT_UPLOADED";
        actorId: string;
        subjectType: "document";
        subjectId: string;
        clientId: string;
        matterId?: string;
        summary: string;
        metadata: Record<string, unknown>;
      };
    }): Promise<unknown>;
  };
};

type DocumentPrisma = DocumentTransaction & {
  $transaction<T>(work: (tx: DocumentTransaction) => Promise<T>): Promise<T>;
};

function actorData(principal: AuthenticatedPrincipal | null) {
  return {
    id: principal?.userId ?? "staging_admin_password_reviewer",
    email: principal?.email ?? "staging.admin.review@example.test",
    name: "Staging Admin Password Reviewer"
  };
}

function fieldValidationFailure(error: ZodError): ServiceResult<never> {
  return serviceFailure({
    code: "VALIDATION_ERROR",
    message: "Document upload input failed validation.",
    fieldErrors: error.flatten().fieldErrors
  });
}

function cleanOptional(value: string | undefined): string | null {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function safeFilename(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed || /[\\/\0-\x1F]/u.test(trimmed) || trimmed === "." || trimmed === "..") {
    return null;
  }

  return trimmed.replace(/\s+/g, " ");
}

export function suggestDocumentFilename(options: {
  clientName: string;
  matterReference?: string | null;
  documentType: string;
  documentDate: string;
}): string {
  const parts = [
    options.clientName,
    options.matterReference || "General",
    options.documentType,
    options.documentDate
  ];

  return parts
    .map((part) => part.trim().replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, ""))
    .filter(Boolean)
    .join("_");
}

export function parseDocumentUploadFormData(formData: FormData): {
  metadata: Record<string, string>;
  file: File | null;
} {
  const fileValue = formData.get("file");

  return {
    metadata: {
      clientId: String(formData.get("clientId") ?? ""),
      documentType: String(formData.get("documentType") ?? ""),
      matterReference: String(formData.get("matterReference") ?? ""),
      documentDate: String(formData.get("documentDate") ?? ""),
      displayFilename: String(formData.get("displayFilename") ?? "")
    },
    file: fileValue instanceof File ? fileValue : null
  };
}

export function parseMatterDocumentUploadFormData(formData: FormData): {
  metadata: Record<string, string>;
  file: File | null;
} {
  const parsed = parseDocumentUploadFormData(formData);

  return {
    metadata: {
      ...parsed.metadata,
      matterId: String(formData.get("matterId") ?? "")
    },
    file: parsed.file
  };
}

export async function listClientDocuments(options: {
  prisma: unknown;
  clientId: string;
}): Promise<ServiceResult<readonly ClientDocumentListItem[]>> {
  const prisma = options.prisma as DocumentPrisma;

  try {
    const records = await prisma.documentRecord.findMany({
      where: {
        clientId: options.clientId,
        status: { not: "ARCHIVED" }
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }]
    });

    return serviceSuccess(records.map((record) => ({
      id: record.id,
      filename: record.filename,
      contentType: record.contentType,
      sizeBytes: record.sizeBytes,
      status: record.status,
      createdAt: record.createdAt,
      documentType: "Saved document",
      matterReference: null,
      documentDate: null
    })));
  } catch {
    return repositoryFailure();
  }
}

export async function listMatterDocuments(options: {
  prisma: unknown;
  matterId: string;
}): Promise<ServiceResult<readonly MatterDocumentListItem[]>> {
  const prisma = options.prisma as DocumentPrisma;

  try {
    const records = await prisma.documentRecord.findMany({
      where: {
        matterId: options.matterId,
        status: { not: "ARCHIVED" }
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }]
    });

    return serviceSuccess(records.map((record) => ({
      id: record.id,
      filename: record.filename,
      contentType: record.contentType,
      sizeBytes: record.sizeBytes,
      status: record.status,
      createdAt: record.createdAt,
      documentType: "Saved matter document",
      matterReference: null,
      documentDate: null
    })));
  } catch {
    return repositoryFailure();
  }
}

export async function loadClientDocuments(clientId: string): Promise<readonly ClientDocumentListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const documents = await listClientDocuments({
      prisma: await getPrismaClient(),
      clientId
    });

    return documents.ok ? documents.data : [];
  } catch {
    return [];
  }
}

export async function loadMatterDocuments(matterId: string): Promise<readonly MatterDocumentListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const documents = await listMatterDocuments({
      prisma: await getPrismaClient(),
      matterId
    });

    return documents.ok ? documents.data : [];
  } catch {
    return [];
  }
}

export async function uploadStagingClientDocument(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  metadata: Record<string, string>;
  file: File | null;
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<StagingDocumentUploadResult>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before staging documents can be uploaded."
    });
  }

  const gate = evaluateStagingDocumentUploadGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging document uploads are not enabled for this session."
    });
  }

  let metadata: ValidatedUploadMetadata;

  try {
    metadata = uploadMetadataSchema.parse(options.metadata);
  } catch (error) {
    if (error instanceof ZodError) {
      return fieldValidationFailure(error);
    }

    return repositoryFailure();
  }

  if (!options.file || options.file.size === 0) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Choose a test document before uploading."
    });
  }

  if (options.file.size > maxStagingDocumentUploadBytes) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Staging document uploads are limited to 10 MB."
    });
  }

  const filename = safeFilename(metadata.displayFilename);

  if (!filename) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Display filename may not contain slashes or control characters."
    });
  }

  const bytes = new Uint8Array(await options.file.arrayBuffer());
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const prisma = options.prisma as DocumentPrisma;
  const actor = actorData(options.principal);
  const matterReference = cleanOptional(metadata.matterReference);

  try {
    const uploaded = await prisma.$transaction(async (tx) => {
      const client = await tx.client.findUnique({
        where: { id: metadata.clientId },
        select: { id: true, displayName: true }
      });

      if (!client) {
        throw new Error("CLIENT_NOT_FOUND");
      }

      const savedActor = await tx.user.upsert({
        where: { id: actor.id },
        update: {
          email: actor.email,
          name: actor.name,
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        },
        create: {
          id: actor.id,
          email: actor.email,
          name: actor.name,
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        }
      });
      const storageKey = `staging/client-documents/${metadata.clientId}/${Date.now()}-${filename}`;
      const document = await tx.documentRecord.create({
        data: {
          clientId: metadata.clientId,
          storageKey,
          filename,
          contentType: options.file?.type || "application/octet-stream",
          sizeBytes: bytes.byteLength,
          visibility: "PRIVATE",
          status: "ACTIVE",
          uploadedById: savedActor.id
        }
      });

      await tx.documentContent.create({
        data: {
          documentId: document.id,
          bytes,
          sha256,
          sizeBytes: bytes.byteLength
        }
      });

      await tx.auditLog.create({
        data: {
          eventType: "DOCUMENT_UPLOADED",
          actorId: savedActor.id,
          targetType: "document",
          targetId: document.id,
          summary: "Staging client document uploaded",
          metadata: {
            source: "staging-client-file-document-upload",
            clientId: client.id,
            documentType: metadata.documentType,
            matterReference,
            documentDate: metadata.documentDate,
            filename,
            sizeBytes: bytes.byteLength,
            sha256
          },
          sensitive: true
        }
      });

      await tx.timelineEvent.create({
        data: {
          eventType: "DOCUMENT_UPLOADED",
          actorId: savedActor.id,
          subjectType: "document",
          subjectId: document.id,
          clientId: client.id,
          summary: `Uploaded staging document: ${filename}`,
          metadata: {
            source: "staging-client-file-document-upload",
            documentType: metadata.documentType,
            matterReference,
            documentDate: metadata.documentDate,
            sizeBytes: bytes.byteLength
          }
        }
      });

      return {
        id: document.id,
        filename: document.filename
      };
    });

    return serviceSuccess(uploaded);
  } catch (error) {
    if (error instanceof Error && error.message === "CLIENT_NOT_FOUND") {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Client file was not found."
      });
    }

    return transactionFailure();
  }
}

export async function uploadStagingMatterDocument(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  metadata: Record<string, string>;
  file: File | null;
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<StagingDocumentUploadResult>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before staging matter documents can be uploaded."
    });
  }

  const gate = evaluateStagingDocumentUploadGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging matter document uploads are not enabled for this session."
    });
  }

  let metadata: ValidatedMatterUploadMetadata;

  try {
    metadata = matterUploadMetadataSchema.parse(options.metadata);
  } catch (error) {
    if (error instanceof ZodError) {
      return fieldValidationFailure(error);
    }

    return repositoryFailure();
  }

  if (!options.file || options.file.size === 0) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Choose a test document before uploading."
    });
  }

  if (options.file.size > maxStagingDocumentUploadBytes) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Staging matter document uploads are limited to 10 MB."
    });
  }

  const filename = safeFilename(metadata.displayFilename);

  if (!filename) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Display filename may not contain slashes or control characters."
    });
  }

  const bytes = new Uint8Array(await options.file.arrayBuffer());
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const prisma = options.prisma as DocumentPrisma;
  const actor = actorData(options.principal);
  const matterReference = cleanOptional(metadata.matterReference);

  try {
    const uploaded = await prisma.$transaction(async (tx) => {
      const matter = await tx.matter.findUnique({
        where: { id: metadata.matterId },
        select: {
          id: true,
          clientId: true,
          accountNumber: true,
          name: true,
          client: {
            select: {
              id: true,
              displayName: true
            }
          }
        }
      });

      if (!matter || matter.clientId !== metadata.clientId) {
        throw new Error("MATTER_NOT_FOUND");
      }

      const savedActor = await tx.user.upsert({
        where: { id: actor.id },
        update: {
          email: actor.email,
          name: actor.name,
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        },
        create: {
          id: actor.id,
          email: actor.email,
          name: actor.name,
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        }
      });
      const storageKey = `staging/matter-documents/${metadata.matterId}/${Date.now()}-${filename}`;
      const document = await tx.documentRecord.create({
        data: {
          clientId: matter.clientId,
          matterId: matter.id,
          storageKey,
          filename,
          contentType: options.file?.type || "application/octet-stream",
          sizeBytes: bytes.byteLength,
          visibility: "PRIVATE",
          status: "ACTIVE",
          uploadedById: savedActor.id
        }
      });

      await tx.documentContent.create({
        data: {
          documentId: document.id,
          bytes,
          sha256,
          sizeBytes: bytes.byteLength
        }
      });

      await tx.auditLog.create({
        data: {
          eventType: "DOCUMENT_UPLOADED",
          actorId: savedActor.id,
          targetType: "document",
          targetId: document.id,
          summary: "Staging matter document uploaded",
          metadata: {
            source: "staging-matter-document-upload",
            clientId: matter.clientId,
            matterId: matter.id,
            matterReference: matterReference ?? matter.accountNumber,
            documentType: metadata.documentType,
            documentDate: metadata.documentDate,
            filename,
            sizeBytes: bytes.byteLength,
            sha256
          },
          sensitive: true
        }
      });

      await tx.timelineEvent.create({
        data: {
          eventType: "DOCUMENT_UPLOADED",
          actorId: savedActor.id,
          subjectType: "document",
          subjectId: document.id,
          clientId: matter.clientId,
          matterId: matter.id,
          summary: `Uploaded matter document: ${filename}`,
          metadata: {
            source: "staging-matter-document-upload",
            documentType: metadata.documentType,
            matterReference: matterReference ?? matter.accountNumber,
            documentDate: metadata.documentDate,
            sizeBytes: bytes.byteLength
          }
        }
      });

      return {
        id: document.id,
        filename: document.filename
      };
    });

    return serviceSuccess(uploaded);
  } catch (error) {
    if (error instanceof Error && error.message === "MATTER_NOT_FOUND") {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Matter was not found for this client file."
      });
    }

    return transactionFailure();
  }
}

export async function getStagingClientDocumentContent(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  clientId: string;
  documentId: string;
  action: "view" | "download";
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<StagingDocumentContentResult>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before staging documents can be opened."
    });
  }

  const gate = evaluateStagingDocumentUploadGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging document access is not enabled for this session."
    });
  }

  const prisma = options.prisma as DocumentPrisma;
  const actor = actorData(options.principal);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const document = await tx.documentRecord.findUnique({
        where: { id: options.documentId },
        include: {
          content: {
            select: {
              bytes: true,
              sizeBytes: true
            }
          }
        }
      });

      if (!document || document.clientId !== options.clientId || !document.content) {
        throw new Error("DOCUMENT_NOT_FOUND");
      }

      const savedActor = await tx.user.upsert({
        where: { id: actor.id },
        update: {
          email: actor.email,
          name: actor.name,
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        },
        create: {
          id: actor.id,
          email: actor.email,
          name: actor.name,
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        }
      });

      await tx.auditLog.create({
        data: {
          eventType: options.action === "download" ? "DOCUMENT_DOWNLOADED" : "DOCUMENT_ACCESSED",
          actorId: savedActor.id,
          targetType: "document",
          targetId: document.id,
          summary: options.action === "download"
            ? "Staging client document downloaded"
            : "Staging client document viewed",
          metadata: {
            source: "staging-client-file-document-access",
            action: options.action,
            clientId: options.clientId,
            filename: document.filename,
            sizeBytes: document.content.sizeBytes
          },
          sensitive: true
        }
      });

      return {
        id: document.id,
        filename: document.filename,
        contentType: document.contentType,
        sizeBytes: document.content.sizeBytes,
        bytes: document.content.bytes
      };
    });

    return serviceSuccess(result);
  } catch (error) {
    if (error instanceof Error && error.message === "DOCUMENT_NOT_FOUND") {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Document was not found for this client file."
      });
    }

    return transactionFailure();
  }
}

export async function getStagingMatterDocumentContent(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  matterId: string;
  documentId: string;
  action: "view" | "download";
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<StagingDocumentContentResult>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before staging matter documents can be opened."
    });
  }

  const gate = evaluateStagingDocumentUploadGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging matter document access is not enabled for this session."
    });
  }

  const prisma = options.prisma as DocumentPrisma;
  const actor = actorData(options.principal);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const document = await tx.documentRecord.findUnique({
        where: { id: options.documentId },
        include: {
          content: {
            select: {
              bytes: true,
              sizeBytes: true
            }
          }
        }
      });

      if (!document || document.matterId !== options.matterId || !document.content) {
        throw new Error("DOCUMENT_NOT_FOUND");
      }

      const savedActor = await tx.user.upsert({
        where: { id: actor.id },
        update: {
          email: actor.email,
          name: actor.name,
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        },
        create: {
          id: actor.id,
          email: actor.email,
          name: actor.name,
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        }
      });

      await tx.auditLog.create({
        data: {
          eventType: options.action === "download" ? "DOCUMENT_DOWNLOADED" : "DOCUMENT_ACCESSED",
          actorId: savedActor.id,
          targetType: "document",
          targetId: document.id,
          summary: options.action === "download"
            ? "Staging matter document downloaded"
            : "Staging matter document viewed",
          metadata: {
            source: "staging-matter-document-access",
            action: options.action,
            matterId: options.matterId,
            filename: document.filename,
            sizeBytes: document.content.sizeBytes
          },
          sensitive: true
        }
      });

      return {
        id: document.id,
        filename: document.filename,
        contentType: document.contentType,
        sizeBytes: document.content.sizeBytes,
        bytes: document.content.bytes
      };
    });

    return serviceSuccess(result);
  } catch (error) {
    if (error instanceof Error && error.message === "DOCUMENT_NOT_FOUND") {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Document was not found for this matter."
      });
    }

    return transactionFailure();
  }
}
