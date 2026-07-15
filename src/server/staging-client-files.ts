import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { evaluateStagingClientFileWriteGate } from "@/config/staging-client-file-writes";
import {
  type CreateClientInput,
  validateClientCreationInput
} from "@/domain/clients";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  type ServiceResult,
  repositoryFailure,
  serviceFailure,
  serviceSuccess,
  transactionFailure
} from "@/services/service-result";
import { ZodError, z } from "zod";

export const createClientFileFormSchema = z.object({
  accountNumber: z.string().trim().min(1, "Account/reference number is required"),
  displayName: z.string().trim().min(1, "Client display name is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  contactName: z.string().trim().optional(),
  email: z.string().trim().email("Email must be valid").optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  openingNote: z.string().trim().max(2000, "Opening note must be 2000 characters or fewer").optional()
});

export type CreateClientFileFormInput = z.input<typeof createClientFileFormSchema>;
export type ValidatedClientFileFormInput = z.output<typeof createClientFileFormSchema>;

export type ClientFileListItem = {
  id: string;
  accountNumber: string;
  displayName: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  updatedAt: Date;
  primaryContactName: string | null;
  primaryContactEmail: string | null;
  primaryContactPhone: string | null;
};

export type ClientFileCreateResult = {
  id: string;
  accountNumber: string;
  displayName: string;
};

export type StagingClientFilePageState = {
  databaseAvailable: boolean;
  writesEnabled: boolean;
};

type PrismaClientRecord = {
  id: string;
  accountNumber: string;
  displayName: string;
  normalizedSearch: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  primaryContactId: string | null;
  updatedAt: Date;
  primaryContact?: {
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
};

type StagingClientFileTransaction = {
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
    create(args: {
      data: CreateClientInput & {
        normalizedSearch: string;
      };
    }): Promise<PrismaClientRecord>;
    update(args: {
      where: { id: string };
      data: { primaryContactId: string };
    }): Promise<PrismaClientRecord>;
    findMany(args: {
      where: {
        status: { not: "ARCHIVED" };
        OR?: Array<{
          normalizedSearch?: { contains: string };
          displayName?: { contains: string };
          accountNumber?: { contains: string };
        }>;
      };
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }];
      take: number;
      include: {
        primaryContact: {
          select: {
            name: true;
            email: true;
            phone: true;
          };
        };
      };
    }): Promise<PrismaClientRecord[]>;
    findUnique(args: {
      where: { id: string };
      include: {
        primaryContact: {
          select: {
            name: true;
            email: true;
            phone: true;
          };
        };
      };
    }): Promise<PrismaClientRecord | null>;
  };
  contact: {
    create(args: {
      data: {
        clientId: string;
        name: string;
        email?: string;
        phone?: string;
        type: "PRIMARY";
      };
    }): Promise<{ id: string }>;
  };
  auditLog: {
    create(args: {
      data: {
        eventType: "CLIENT_CREATED";
        actorId: string;
        targetType: "client";
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
        eventType: "CLIENT_CREATED";
        actorId: string;
        subjectType: "client";
        subjectId: string;
        clientId: string;
        summary: string;
        metadata: Record<string, unknown>;
      };
    }): Promise<unknown>;
  };
};

type StagingClientFilePrisma = StagingClientFileTransaction & {
  $transaction<T>(work: (tx: StagingClientFileTransaction) => Promise<T>): Promise<T>;
};

function validationFailure(error: ZodError): ServiceResult<never> {
  return serviceFailure({
    code: "VALIDATION_ERROR",
    message: "Client file input failed validation.",
    fieldErrors: error.flatten().fieldErrors
  });
}

function mapListItem(record: PrismaClientRecord): ClientFileListItem {
  return {
    id: record.id,
    accountNumber: record.accountNumber,
    displayName: record.displayName,
    status: record.status,
    updatedAt: record.updatedAt,
    primaryContactName: record.primaryContact?.name ?? null,
    primaryContactEmail: record.primaryContact?.email ?? null,
    primaryContactPhone: record.primaryContact?.phone ?? null
  };
}

function cleanOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

export function validateClientFileFormInput(
  input: CreateClientFileFormInput
): ServiceResult<ValidatedClientFileFormInput> {
  try {
    return serviceSuccess(createClientFileFormSchema.parse(input));
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure(error);
    }

    return repositoryFailure();
  }
}

export function parseClientFileFormData(formData: FormData): CreateClientFileFormInput {
  return {
    accountNumber: String(formData.get("accountNumber") ?? ""),
    displayName: String(formData.get("displayName") ?? ""),
    status: String(formData.get("status") ?? "ACTIVE") as CreateClientFileFormInput["status"],
    contactName: String(formData.get("contactName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    openingNote: String(formData.get("openingNote") ?? "")
  };
}

export async function listStagingClientFiles(options: {
  prisma: unknown;
  query?: string;
  limit?: number;
}): Promise<ServiceResult<readonly ClientFileListItem[]>> {
  const prisma = options.prisma as StagingClientFilePrisma;
  const query = options.query?.trim().toLowerCase();

  try {
    const records = await prisma.client.findMany({
      where: {
        status: { not: "ARCHIVED" },
        ...(query
          ? {
              OR: [
                { normalizedSearch: { contains: query } },
                { displayName: { contains: options.query?.trim() ?? "" } },
                { accountNumber: { contains: options.query?.trim() ?? "" } }
              ]
            }
          : {})
      },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: options.limit ?? 50,
      include: {
        primaryContact: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return serviceSuccess(records.map(mapListItem));
  } catch {
    return repositoryFailure();
  }
}

export async function getStagingClientFile(options: {
  prisma: unknown;
  id: string;
}): Promise<ServiceResult<ClientFileListItem>> {
  const prisma = options.prisma as StagingClientFilePrisma;

  try {
    const record = await prisma.client.findUnique({
      where: { id: options.id },
      include: {
        primaryContact: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!record) {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Client file was not found."
      });
    }

    return serviceSuccess(mapListItem(record));
  } catch {
    return repositoryFailure();
  }
}

export async function loadStagingClientFileList(options: {
  query?: string;
  limit?: number;
}): Promise<{
  databaseAvailable: boolean;
  clients: readonly ClientFileListItem[];
}> {
  if (!hasDatabaseUrl()) {
    return { databaseAvailable: false, clients: [] };
  }

  try {
    const clients = await listStagingClientFiles({
      prisma: await getPrismaClient(),
      query: options.query,
      limit: options.limit
    });

    return {
      databaseAvailable: clients.ok,
      clients: clients.ok ? clients.data : []
    };
  } catch {
    return { databaseAvailable: false, clients: [] };
  }
}

export async function loadStagingClientFileDetail(id: string): Promise<ClientFileListItem | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  try {
    const client = await getStagingClientFile({
      prisma: await getPrismaClient(),
      id
    });

    return client.ok ? client.data : null;
  } catch {
    return null;
  }
}

export function getStagingClientFilePageState(
  principal: AuthenticatedPrincipal | null,
  environment: Partial<Record<string, string | undefined>> = process.env
): StagingClientFilePageState {
  const gate = evaluateStagingClientFileWriteGate(principal, environment);

  return {
    databaseAvailable: hasDatabaseUrl(),
    writesEnabled: gate.enabled
  };
}

export async function createStagingClientFile(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  input: CreateClientFileFormInput;
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<ClientFileCreateResult>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before staging client files can be saved."
    });
  }

  const gate = evaluateStagingClientFileWriteGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging client file writes are not enabled for this session."
    });
  }

  const parsed = validateClientFileFormInput(options.input);

  if (!parsed.ok) {
    return parsed;
  }

  const clientInput = validateClientCreationInput({
    accountNumber: parsed.data.accountNumber,
    displayName: parsed.data.displayName,
    status: parsed.data.status
  });
  const contactName = cleanOptional(parsed.data.contactName);
  const email = cleanOptional(parsed.data.email);
  const phone = cleanOptional(parsed.data.phone);
  const openingNote = cleanOptional(parsed.data.openingNote);
  const prisma = options.prisma as StagingClientFilePrisma;

  try {
    const created = await prisma.$transaction(async (tx) => {
      const actor = await tx.user.upsert({
        where: { id: options.principal?.userId ?? "staging_admin_password_reviewer" },
        update: {
          email: options.principal?.email ?? "staging.admin.review@example.test",
          name: "Staging Admin Password Reviewer",
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        },
        create: {
          id: options.principal?.userId ?? "staging_admin_password_reviewer",
          email: options.principal?.email ?? "staging.admin.review@example.test",
          name: "Staging Admin Password Reviewer",
          status: "ACTIVE",
          authProvider: "FUTURE_PROVIDER"
        }
      });
      const client = await tx.client.create({
        data: clientInput
      });

      if (contactName || email || phone) {
        const contact = await tx.contact.create({
          data: {
            clientId: client.id,
            name: contactName ?? "Primary contact pending",
            ...(email ? { email } : {}),
            ...(phone ? { phone } : {}),
            type: "PRIMARY"
          }
        });

        await tx.client.update({
          where: { id: client.id },
          data: { primaryContactId: contact.id }
        });
      }

      await tx.auditLog.create({
        data: {
          eventType: "CLIENT_CREATED",
          actorId: actor.id,
          targetType: "client",
          targetId: client.id,
          summary: "Staging client file created",
          metadata: {
            source: "staging-client-file-form",
            accountNumber: client.accountNumber,
            status: client.status,
            hasPrimaryContact: Boolean(contactName || email || phone),
            hasOpeningNote: Boolean(openingNote)
          },
          sensitive: true
        }
      });

      await tx.timelineEvent.create({
        data: {
          eventType: "CLIENT_CREATED",
          actorId: actor.id,
          subjectType: "client",
          subjectId: client.id,
          clientId: client.id,
          summary: openingNote ?? "Staging client file opened.",
          metadata: {
            source: "staging-client-file-form",
            accountNumber: client.accountNumber
          }
        }
      });

      return {
        id: client.id,
        accountNumber: client.accountNumber,
        displayName: client.displayName
      };
    });

    return serviceSuccess(created);
  } catch {
    return transactionFailure();
  }
}

export function databaseStatus(): "available" | "missing_database_url" {
  return hasDatabaseUrl() ? "available" : "missing_database_url";
}
