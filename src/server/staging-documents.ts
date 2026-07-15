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

export type StagingDocumentUploadResult = {
  id: string;
  filename: string;
};

const uploadMetadataSchema = z.object({
  clientId: z.string().trim().min(1, "Client file is required"),
  documentType: z.string().trim().min(1, "Document type is required").max(80),
  matterReference: z.string().trim().max(120).optional(),
  documentDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Document date must use YYYY-MM-DD"),
  displayFilename: z.string().trim().min(1, "Display filename is required").max(180)
});

type ValidatedUploadMetadata = z.output<typeof uploadMetadataSchema>;

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
  documentRecord: {
    create(args: {
      data: {
        clientId: string;
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
        clientId: string;
        status: { not: "ARCHIVED" };
      };
      orderBy: [{ createdAt: "desc" }, { id: "asc" }];
    }): Promise<PrismaDocumentRecord[]>;
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
        eventType: "DOCUMENT_UPLOADED";
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
