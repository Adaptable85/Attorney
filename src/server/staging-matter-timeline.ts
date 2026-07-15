import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { evaluateStagingMatterWritesGate } from "@/config/staging-admin-live-gates";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  type ServiceResult,
  repositoryFailure,
  serviceFailure,
  serviceSuccess,
  transactionFailure
} from "@/services/service-result";
import { ZodError, z } from "zod";

const timelineNoteSchema = z.object({
  matterId: z.string().trim().min(1, "Matter is required"),
  title: z.string().trim().min(1, "Timeline title is required").max(160),
  eventDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Event date must use YYYY-MM-DD"),
  body: z.string().trim().min(1, "Timeline detail is required").max(3000)
});

export type StagingMatterTimelineFormInput = z.input<typeof timelineNoteSchema>;

export type StagingMatterTimelineItem = {
  id: string;
  eventType: string;
  subjectType: string;
  subjectId: string;
  summary: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};

type MatterTimelineTransaction = {
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
  matter: {
    findUnique(args: {
      where: { id: string };
      select: {
        id: true;
        clientId: true;
        name: true;
        accountNumber: true;
      };
    }): Promise<{
      id: string;
      clientId: string;
      name: string;
      accountNumber: string;
    } | null>;
  };
  matterNote: {
    create(args: {
      data: {
        matterId: string;
        authorId: string;
        body: string;
        internal: true;
      };
    }): Promise<{ id: string; body: string }>;
  };
  timelineEvent: {
    create(args: {
      data: {
        eventType: "MATTER_NOTE_ADDED";
        actorId: string;
        subjectType: "matter_note";
        subjectId: string;
        clientId: string;
        matterId: string;
        summary: string;
        metadata: Record<string, unknown>;
      };
    }): Promise<StagingMatterTimelineItem>;
    findMany(args: {
      where: { matterId: string };
      orderBy: [{ createdAt: "desc" }, { id: "asc" }];
      take: number;
    }): Promise<StagingMatterTimelineItem[]>;
  };
  auditLog: {
    create(args: {
      data: {
        eventType: "MATTER_NOTE_ADDED";
        actorId: string;
        targetType: "matter";
        targetId: string;
        summary: string;
        metadata: Record<string, unknown>;
        sensitive: true;
      };
    }): Promise<unknown>;
  };
};

type MatterTimelinePrisma = MatterTimelineTransaction & {
  $transaction<T>(work: (tx: MatterTimelineTransaction) => Promise<T>): Promise<T>;
};

function actorData(principal: AuthenticatedPrincipal | null) {
  return {
    id: principal?.userId ?? "staging_admin_password_reviewer",
    email: principal?.email ?? "staging.admin.review@example.test",
    name: "Staging Admin Password Reviewer"
  };
}

function validationFailure(error: ZodError): ServiceResult<never> {
  return serviceFailure({
    code: "VALIDATION_ERROR",
    message: "Matter timeline input failed validation.",
    fieldErrors: error.flatten().fieldErrors
  });
}

export function parseMatterTimelineFormData(formData: FormData): StagingMatterTimelineFormInput {
  return {
    matterId: String(formData.get("matterId") ?? ""),
    title: String(formData.get("title") ?? ""),
    eventDate: String(formData.get("eventDate") ?? ""),
    body: String(formData.get("body") ?? "")
  };
}

export async function listMatterTimeline(options: {
  prisma: unknown;
  matterId: string;
  limit?: number;
}): Promise<ServiceResult<readonly StagingMatterTimelineItem[]>> {
  const prisma = options.prisma as MatterTimelinePrisma;

  try {
    const events = await prisma.timelineEvent.findMany({
      where: { matterId: options.matterId },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: options.limit ?? 50
    });

    return serviceSuccess(events);
  } catch {
    return repositoryFailure();
  }
}

export async function loadMatterTimeline(matterId: string): Promise<readonly StagingMatterTimelineItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const timeline = await listMatterTimeline({
      prisma: await getPrismaClient(),
      matterId
    });

    return timeline.ok ? timeline.data : [];
  } catch {
    return [];
  }
}

export async function addStagingMatterTimelineNote(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  input: StagingMatterTimelineFormInput;
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<{ id: string }>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before matter timeline notes can be saved."
    });
  }

  const gate = evaluateStagingMatterWritesGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging matter timeline writes are not enabled for this session."
    });
  }

  let parsed: z.output<typeof timelineNoteSchema>;

  try {
    parsed = timelineNoteSchema.parse(options.input);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure(error);
    }

    return repositoryFailure();
  }

  const prisma = options.prisma as MatterTimelinePrisma;
  const actor = actorData(options.principal);

  try {
    const created = await prisma.$transaction(async (tx) => {
      const matter = await tx.matter.findUnique({
        where: { id: parsed.matterId },
        select: {
          id: true,
          clientId: true,
          name: true,
          accountNumber: true
        }
      });

      if (!matter) {
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

      const note = await tx.matterNote.create({
        data: {
          matterId: matter.id,
          authorId: savedActor.id,
          body: `${parsed.title}\n\n${parsed.body}`,
          internal: true
        }
      });

      await tx.auditLog.create({
        data: {
          eventType: "MATTER_NOTE_ADDED",
          actorId: savedActor.id,
          targetType: "matter",
          targetId: matter.id,
          summary: "Staging legal timeline note added",
          metadata: {
            source: "staging-matter-legal-timeline",
            matterId: matter.id,
            matterAccountNumber: matter.accountNumber,
            title: parsed.title,
            eventDate: parsed.eventDate
          },
          sensitive: true
        }
      });

      const timeline = await tx.timelineEvent.create({
        data: {
          eventType: "MATTER_NOTE_ADDED",
          actorId: savedActor.id,
          subjectType: "matter_note",
          subjectId: note.id,
          clientId: matter.clientId,
          matterId: matter.id,
          summary: parsed.title,
          metadata: {
            source: "staging-matter-legal-timeline",
            eventDate: parsed.eventDate,
            body: parsed.body
          }
        }
      });

      return { id: timeline.id };
    });

    return serviceSuccess(created);
  } catch (error) {
    if (error instanceof Error && error.message === "MATTER_NOT_FOUND") {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Matter was not found."
      });
    }

    return transactionFailure();
  }
}
