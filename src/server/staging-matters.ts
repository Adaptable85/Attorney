import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { evaluateStagingMatterWritesGate } from "@/config/staging-admin-live-gates";
import {
  matterStatuses,
  matterTypes,
  validateMatterCreationInput,
  type CreateMatterInput
} from "@/domain/matters";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  type ServiceResult,
  repositoryFailure,
  serviceFailure,
  serviceSuccess,
  transactionFailure
} from "@/services/service-result";
import { ZodError, z } from "zod";

const matterCreateFormSchema = z.object({
  clientId: z.string().trim().min(1, "Client file is required"),
  accountNumber: z.string().trim().min(1, "Matter/reference number is required"),
  name: z.string().trim().min(1, "Matter name is required"),
  description: z.string().trim().min(1, "Matter description is required").max(2000),
  type: z.enum(matterTypes),
  status: z.enum(matterStatuses).default("OPEN"),
  nextStepDueDate: z.string().trim().optional()
});

export type StagingMatterCreateFormInput = z.input<typeof matterCreateFormSchema>;

export type StagingMatterListItem = {
  id: string;
  clientId: string;
  clientDisplayName?: string | null;
  accountNumber: string;
  name: string;
  description: string;
  type: z.output<typeof matterCreateFormSchema>["type"];
  status: z.output<typeof matterCreateFormSchema>["status"];
  nextStepDueDate: Date | null;
  updatedAt: Date;
};

export type StagingMatterCreateResult = {
  id: string;
  clientId: string;
  accountNumber: string;
  name: string;
};

export type StagingMatterPageState = {
  databaseAvailable: boolean;
  writesEnabled: boolean;
};

type PrismaMatterRecord = StagingMatterListItem & {
  normalizedSearch: string;
  client?: {
    displayName: string;
  } | null;
};

type StagingMatterTransaction = {
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
    findUnique(args: { where: { id: string }; select: { id: true; displayName: true } }): Promise<{
      id: string;
      displayName: string;
    } | null>;
  };
  matter: {
    create(args: {
      data: {
        clientId: string;
        accountNumber: string;
        normalizedSearch: string;
        name: string;
        description: string;
        type: StagingMatterListItem["type"];
        status: StagingMatterListItem["status"];
        nextStepDueDate?: Date;
      };
    }): Promise<PrismaMatterRecord>;
    findMany(args: {
      where: {
        status: { not: "ARCHIVED" };
        clientId?: string;
        OR?: Array<{
          normalizedSearch?: { contains: string };
          name?: { contains: string };
          accountNumber?: { contains: string };
        }>;
      };
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }];
      take: number;
      include?: {
        client: {
          select: {
            displayName: true;
          };
        };
      };
    }): Promise<PrismaMatterRecord[]>;
    findUnique(args: {
      where: { id: string };
      include: {
        client: {
          select: {
            displayName: true;
          };
        };
      };
    }): Promise<PrismaMatterRecord | null>;
  };
  auditLog: {
    create(args: {
      data: {
        eventType: "MATTER_CREATED";
        actorId: string;
        targetType: "matter";
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
        eventType: "MATTER_CREATED";
        actorId: string;
        subjectType: "matter";
        subjectId: string;
        clientId: string;
        matterId: string;
        summary: string;
        metadata: Record<string, unknown>;
      };
    }): Promise<unknown>;
  };
};

type StagingMatterPrisma = StagingMatterTransaction & {
  $transaction<T>(work: (tx: StagingMatterTransaction) => Promise<T>): Promise<T>;
};

function actorData(principal: AuthenticatedPrincipal | null) {
  return {
    id: principal?.userId ?? "staging_admin_password_reviewer",
    email: principal?.email ?? "staging.admin.review@example.test",
    name: "Staging Admin Password Reviewer"
  };
}

function mapMatter(record: PrismaMatterRecord): StagingMatterListItem {
  return {
    id: record.id,
    clientId: record.clientId,
    clientDisplayName: record.client?.displayName ?? record.clientDisplayName ?? null,
    accountNumber: record.accountNumber,
    name: record.name,
    description: record.description,
    type: record.type,
    status: record.status,
    nextStepDueDate: record.nextStepDueDate,
    updatedAt: record.updatedAt
  };
}

function validationFailure(error: ZodError): ServiceResult<never> {
  return serviceFailure({
    code: "VALIDATION_ERROR",
    message: "Matter input failed validation.",
    fieldErrors: error.flatten().fieldErrors
  });
}

function parseNextStepDueDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(date.valueOf()) ? undefined : date;
}

export function parseMatterCreateFormData(formData: FormData): StagingMatterCreateFormInput {
  return {
    clientId: String(formData.get("clientId") ?? ""),
    accountNumber: String(formData.get("accountNumber") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    type: String(formData.get("type") ?? "OTHER") as StagingMatterCreateFormInput["type"],
    status: String(formData.get("status") ?? "OPEN") as StagingMatterCreateFormInput["status"],
    nextStepDueDate: String(formData.get("nextStepDueDate") ?? "")
  };
}

export function validateMatterCreateFormInput(input: StagingMatterCreateFormInput): ServiceResult<CreateMatterInput> {
  try {
    const parsed = matterCreateFormSchema.parse(input);

    return serviceSuccess({
      clientId: parsed.clientId,
      accountNumber: parsed.accountNumber,
      name: parsed.name,
      description: parsed.description,
      type: parsed.type,
      status: parsed.status,
      ...(parseNextStepDueDate(parsed.nextStepDueDate) ? {
        nextStepDueDate: parseNextStepDueDate(parsed.nextStepDueDate)
      } : {})
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure(error);
    }

    return repositoryFailure();
  }
}

export async function listStagingMatters(options: {
  prisma: unknown;
  clientId?: string;
  query?: string;
  limit?: number;
}): Promise<ServiceResult<readonly StagingMatterListItem[]>> {
  const prisma = options.prisma as StagingMatterPrisma;
  const query = options.query?.trim().toLowerCase();

  try {
    const matters = await prisma.matter.findMany({
      where: {
        status: { not: "ARCHIVED" },
        ...(options.clientId ? { clientId: options.clientId } : {}),
        ...(query
          ? {
              OR: [
                { normalizedSearch: { contains: query } },
                { name: { contains: options.query?.trim() ?? "" } },
                { accountNumber: { contains: options.query?.trim() ?? "" } }
              ]
            }
          : {})
      },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: options.limit ?? 50,
      include: {
        client: {
          select: {
            displayName: true
          }
        }
      }
    });

    return serviceSuccess(matters.map(mapMatter));
  } catch {
    return repositoryFailure();
  }
}

export async function getStagingMatter(options: {
  prisma: unknown;
  id: string;
}): Promise<ServiceResult<StagingMatterListItem>> {
  const prisma = options.prisma as StagingMatterPrisma;

  try {
    const matter = await prisma.matter.findUnique({
      where: { id: options.id },
      include: {
        client: {
          select: {
            displayName: true
          }
        }
      }
    });

    if (!matter) {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Matter was not found."
      });
    }

    return serviceSuccess(mapMatter(matter));
  } catch {
    return repositoryFailure();
  }
}

export async function loadStagingMatters(options: {
  clientId?: string;
  query?: string;
  limit?: number;
} = {}): Promise<readonly StagingMatterListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const result = await listStagingMatters({
      prisma: await getPrismaClient(),
      ...options
    });

    return result.ok ? result.data : [];
  } catch {
    return [];
  }
}

export async function loadStagingMatter(id: string): Promise<StagingMatterListItem | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  try {
    const result = await getStagingMatter({
      prisma: await getPrismaClient(),
      id
    });

    return result.ok ? result.data : null;
  } catch {
    return null;
  }
}

export function getStagingMatterPageState(
  principal: AuthenticatedPrincipal | null,
  environment: Partial<Record<string, string | undefined>> = process.env
): StagingMatterPageState {
  return {
    databaseAvailable: hasDatabaseUrl(),
    writesEnabled: evaluateStagingMatterWritesGate(principal, environment).enabled
  };
}

export async function createStagingMatter(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  input: StagingMatterCreateFormInput;
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<StagingMatterCreateResult>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before staging matters can be saved."
    });
  }

  const gate = evaluateStagingMatterWritesGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging matter writes are not enabled for this session."
    });
  }

  const parsed = validateMatterCreateFormInput(options.input);

  if (!parsed.ok) {
    return parsed;
  }

  const matter = validateMatterCreationInput(parsed.data);
  const prisma = options.prisma as StagingMatterPrisma;
  const actor = actorData(options.principal);

  try {
    const created = await prisma.$transaction(async (tx) => {
      const client = await tx.client.findUnique({
        where: { id: matter.clientId },
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

      const savedMatter = await tx.matter.create({
        data: {
          clientId: matter.clientId,
          accountNumber: matter.accountNumber,
          normalizedSearch: matter.normalizedSearch,
          name: matter.name,
          description: matter.description,
          type: matter.type,
          status: matter.status,
          ...(matter.nextStepDueDate ? { nextStepDueDate: matter.nextStepDueDate } : {})
        }
      });

      await tx.auditLog.create({
        data: {
          eventType: "MATTER_CREATED",
          actorId: savedActor.id,
          targetType: "matter",
          targetId: savedMatter.id,
          summary: "Staging matter opened inside client file",
          metadata: {
            source: "staging-client-file-matter-form",
            clientId: client.id,
            clientDisplayName: client.displayName,
            accountNumber: savedMatter.accountNumber,
            type: savedMatter.type,
            status: savedMatter.status
          },
          sensitive: true
        }
      });

      await tx.timelineEvent.create({
        data: {
          eventType: "MATTER_CREATED",
          actorId: savedActor.id,
          subjectType: "matter",
          subjectId: savedMatter.id,
          clientId: client.id,
          matterId: savedMatter.id,
          summary: `Opened staging matter: ${savedMatter.name}`,
          metadata: {
            source: "staging-client-file-matter-form",
            accountNumber: savedMatter.accountNumber,
            type: savedMatter.type,
            status: savedMatter.status
          }
        }
      });

      return {
        id: savedMatter.id,
        clientId: savedMatter.clientId,
        accountNumber: savedMatter.accountNumber,
        name: savedMatter.name
      };
    });

    return serviceSuccess(created);
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
