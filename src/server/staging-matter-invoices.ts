import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { evaluateStagingMatterInvoicesGate } from "@/config/staging-admin-live-gates";
import { getPrismaClient, hasDatabaseUrl } from "@/db/prisma";
import {
  type ServiceResult,
  repositoryFailure,
  serviceFailure,
  serviceSuccess,
  transactionFailure
} from "@/services/service-result";
import { ZodError, z } from "zod";

const billingCategorySchema = z.enum([
  "TIME",
  "FOLIO",
  "PAGE",
  "FIXED_TARIFF",
  "DISBURSEMENT",
  "ADJUSTMENT",
  "CORRECTION"
]);
const vatTreatmentSchema = z.enum(["VAT_ON_FEES", "NO_VAT", "VAT_EXEMPT", "CUSTOM"]);

const draftBillingLineSchema = z.object({
  matterId: z.string().trim().min(1, "Matter is required"),
  description: z.string().trim().min(1, "Description is required").max(500),
  category: billingCategorySchema,
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  unitAmountCents: z.coerce.number().int().min(0, "Amount must be zero or greater"),
  vatTreatment: vatTreatmentSchema.default("VAT_ON_FEES")
});

export type StagingMatterBillingLineInput = z.input<typeof draftBillingLineSchema>;

export type StagingMatterBillingLineItem = {
  id: string;
  matterId: string;
  description: string;
  category: z.output<typeof billingCategorySchema>;
  status: "DRAFT" | "AWAITING_REVIEW" | "APPROVED_FOR_INVOICE" | "REJECTED" | "INVOICED" | "CORRECTED";
  quantity: number;
  unitAmountCents: number;
  totalAmountCents: number;
  currency: string;
  vatTreatment: z.output<typeof vatTreatmentSchema>;
  vatAmountCents: number;
  createdAt: Date;
};

export type StagingMatterDraftInvoice = {
  id: string;
  clientId: string;
  matterId: string;
  internalDraftReference: string;
  officialInvoiceNumber: string | null;
  status: "DRAFT";
  subtotalCents: number;
  vatAmountCents: number;
  totalCents: number;
  currency: string;
  createdAt: Date;
  lines: readonly {
    id: string;
    description: string;
    totalAmountCents: number;
    vatAmountCents: number;
  }[];
};

export type StagingClientStatementLine = {
  id: string;
  statementSnapshotId: string;
  invoiceId: string | null;
  matterReference: string | null;
  draftInvoiceReference: string | null;
  description: string;
  debitCents: number;
  creditCents: number;
  balanceCents: number;
  lineDate: Date | null;
  position: number;
};

type MatterInvoiceTransaction = {
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
        accountNumber: true;
        name: true;
      };
    }): Promise<{ id: string; clientId: string; accountNumber: string; name: string } | null>;
  };
  billingLineItem: {
    create(args: {
      data: {
        matterId: string;
        description: string;
        category: StagingMatterBillingLineItem["category"];
        status: "DRAFT";
        quantity: number;
        unitAmountCents: number;
        totalAmountCents: number;
        currency: "ZAR";
        vatTreatment: StagingMatterBillingLineItem["vatTreatment"];
        vatAmountCents: number;
        source: "MANUAL";
        createdById: string;
      };
    }): Promise<StagingMatterBillingLineItem>;
    findMany(args: {
      where: {
        matterId: string;
        status?: "DRAFT";
      };
      orderBy: [{ createdAt: "asc" }, { id: "asc" }];
    }): Promise<StagingMatterBillingLineItem[]>;
    updateMany(args: {
      where: {
        id: { in: string[] };
      };
      data: {
        status: "INVOICED";
      };
    }): Promise<{ count: number }>;
  };
  invoice: {
    create(args: {
      data: {
        clientId: string;
        matterId: string;
        internalDraftReference: string;
        officialInvoiceNumber: null;
        status: "DRAFT";
        subtotalCents: number;
        vatAmountCents: number;
        totalCents: number;
        currency: "ZAR";
        source: "MANUAL";
        createdById: string;
        lines: {
          create: Array<{
            billingLineItemId: string;
            description: string;
            category: StagingMatterBillingLineItem["category"];
            quantity: number;
            unitAmountCents: number;
            totalAmountCents: number;
            vatTreatment: StagingMatterBillingLineItem["vatTreatment"];
            vatAmountCents: number;
            currency: "ZAR";
            position: number;
          }>;
        };
      };
      include: {
        lines: true;
      };
    }): Promise<StagingMatterDraftInvoice>;
    findMany(args: {
      where: { matterId: string };
      orderBy: [{ createdAt: "desc" }, { id: "asc" }];
      include: { lines: true };
    }): Promise<StagingMatterDraftInvoice[]>;
  };
  statementSnapshot: {
    findFirst(args: {
      where: { clientId: string; matterId: null; status: "DRAFT" };
      orderBy: { createdAt: "desc" };
    }): Promise<{
      id: string;
      clientId: string;
      closingBalanceCents: number;
      currency: string;
    } | null>;
    create(args: {
      data: {
        clientId: string;
        matterId: null;
        status: "DRAFT";
        openingBalanceCents: 0;
        closingBalanceCents: number;
        currency: "ZAR";
        createdById: string;
      };
    }): Promise<{
      id: string;
      clientId: string;
      closingBalanceCents: number;
      currency: string;
    }>;
    update(args: {
      where: { id: string };
      data: { closingBalanceCents: number };
    }): Promise<unknown>;
  };
  statementLine: {
    findMany(args: {
      where: { statementSnapshotId: string };
      orderBy: [{ position: "asc" }, { id: "asc" }];
    }): Promise<Array<{ position: number; balanceCents: number }>>;
    create(args: {
      data: {
        statementSnapshotId: string;
        invoiceId: string;
        description: string;
        lineDate: Date;
        debitCents: number;
        creditCents: 0;
        balanceCents: number;
        currency: "ZAR";
        position: number;
      };
    }): Promise<unknown>;
  };
  auditLog: {
    create(args: {
      data: {
        eventType: "BILLING_LINE_ITEM_CREATED" | "INVOICE_CREATED" | "STATEMENT_SNAPSHOT_CREATED";
        actorId: string;
        targetType: string;
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
        eventType: "AUDIT_EVENT_RECORDED";
        actorId: string;
        subjectType: string;
        subjectId: string;
        clientId: string;
        matterId: string;
        summary: string;
        metadata: Record<string, unknown>;
      };
    }): Promise<unknown>;
  };
};

type MatterInvoicePrisma = MatterInvoiceTransaction & {
  $transaction<T>(work: (tx: MatterInvoiceTransaction) => Promise<T>): Promise<T>;
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
    message: "Matter invoice input failed validation.",
    fieldErrors: error.flatten().fieldErrors
  });
}

function vatAmountFor(totalAmountCents: number, vatTreatment: StagingMatterBillingLineItem["vatTreatment"]): number {
  return vatTreatment === "VAT_ON_FEES" ? Math.round(totalAmountCents * 0.15) : 0;
}

function draftReference(matterReference: string, now = new Date()): string {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const shortId = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `DRAFT-${matterReference}-${date}-${shortId}`;
}

function formatMoney(amountCents: number): string {
  return `R ${(amountCents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function parseMatterBillingLineFormData(formData: FormData): StagingMatterBillingLineInput {
  return {
    matterId: String(formData.get("matterId") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? "TIME") as StagingMatterBillingLineInput["category"],
    quantity: String(formData.get("quantity") ?? "1"),
    unitAmountCents: String(formData.get("unitAmountCents") ?? "0"),
    vatTreatment: String(formData.get("vatTreatment") ?? "VAT_ON_FEES") as StagingMatterBillingLineInput["vatTreatment"]
  };
}

export async function listMatterBillingLines(options: {
  prisma: unknown;
  matterId: string;
}): Promise<ServiceResult<readonly StagingMatterBillingLineItem[]>> {
  const prisma = options.prisma as MatterInvoicePrisma;

  try {
    return serviceSuccess(await prisma.billingLineItem.findMany({
      where: { matterId: options.matterId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }]
    }));
  } catch {
    return repositoryFailure();
  }
}

export async function listMatterDraftInvoices(options: {
  prisma: unknown;
  matterId: string;
}): Promise<ServiceResult<readonly StagingMatterDraftInvoice[]>> {
  const prisma = options.prisma as MatterInvoicePrisma;

  try {
    return serviceSuccess(await prisma.invoice.findMany({
      where: { matterId: options.matterId },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      include: { lines: true }
    }));
  } catch {
    return repositoryFailure();
  }
}

export async function loadMatterBillingLines(matterId: string): Promise<readonly StagingMatterBillingLineItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const result = await listMatterBillingLines({
      prisma: await getPrismaClient(),
      matterId
    });

    return result.ok ? result.data : [];
  } catch {
    return [];
  }
}

export async function loadMatterDraftInvoices(matterId: string): Promise<readonly StagingMatterDraftInvoice[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const result = await listMatterDraftInvoices({
      prisma: await getPrismaClient(),
      matterId
    });

    return result.ok ? result.data : [];
  } catch {
    return [];
  }
}

export async function addMatterDraftBillingLine(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  input: StagingMatterBillingLineInput;
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<{ id: string }>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before matter billing lines can be saved."
    });
  }

  const gate = evaluateStagingMatterInvoicesGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging matter invoice writes are not enabled for this session."
    });
  }

  let parsed: z.output<typeof draftBillingLineSchema>;

  try {
    parsed = draftBillingLineSchema.parse(options.input);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure(error);
    }

    return repositoryFailure();
  }

  const totalAmountCents = parsed.quantity * parsed.unitAmountCents;
  const vatAmountCents = vatAmountFor(totalAmountCents, parsed.vatTreatment);
  const prisma = options.prisma as MatterInvoicePrisma;
  const actor = actorData(options.principal);

  try {
    const line = await prisma.$transaction(async (tx) => {
      const matter = await tx.matter.findUnique({
        where: { id: parsed.matterId },
        select: { id: true, clientId: true, accountNumber: true, name: true }
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

      const created = await tx.billingLineItem.create({
        data: {
          matterId: matter.id,
          description: parsed.description,
          category: parsed.category,
          status: "DRAFT",
          quantity: parsed.quantity,
          unitAmountCents: parsed.unitAmountCents,
          totalAmountCents,
          currency: "ZAR",
          vatTreatment: parsed.vatTreatment,
          vatAmountCents,
          source: "MANUAL",
          createdById: savedActor.id
        }
      });

      await tx.auditLog.create({
        data: {
          eventType: "BILLING_LINE_ITEM_CREATED",
          actorId: savedActor.id,
          targetType: "billing_line_item",
          targetId: created.id,
          summary: "Staging matter draft billing line created",
          metadata: {
            matterId: matter.id,
            clientId: matter.clientId,
            amountCents: totalAmountCents,
            vatAmountCents
          },
          sensitive: true
        }
      });

      await tx.timelineEvent.create({
        data: {
          eventType: "AUDIT_EVENT_RECORDED",
          actorId: savedActor.id,
          subjectType: "billing_line_item",
          subjectId: created.id,
          clientId: matter.clientId,
          matterId: matter.id,
          summary: `Draft billing line added: ${parsed.description}`,
          metadata: {
            amount: formatMoney(totalAmountCents),
            vat: formatMoney(vatAmountCents)
          }
        }
      });

      return created;
    });

    return serviceSuccess({ id: line.id });
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

export async function createMatterDraftInvoice(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  matterId: string;
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<{ id: string; internalDraftReference: string }>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before matter invoices can be saved."
    });
  }

  const gate = evaluateStagingMatterInvoicesGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging matter invoice writes are not enabled for this session."
    });
  }

  const prisma = options.prisma as MatterInvoicePrisma;
  const actor = actorData(options.principal);

  try {
    const invoice = await prisma.$transaction(async (tx) => {
      const matter = await tx.matter.findUnique({
        where: { id: options.matterId },
        select: { id: true, clientId: true, accountNumber: true, name: true }
      });

      if (!matter) {
        throw new Error("MATTER_NOT_FOUND");
      }

      const lines = await tx.billingLineItem.findMany({
        where: { matterId: matter.id, status: "DRAFT" },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }]
      });

      if (!lines.length) {
        throw new Error("NO_DRAFT_LINES");
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
      const subtotalCents = lines.reduce((total, line) => total + line.totalAmountCents, 0);
      const vatAmountCents = lines.reduce((total, line) => total + line.vatAmountCents, 0);
      const totalCents = subtotalCents + vatAmountCents;
      const createdInvoice = await tx.invoice.create({
        data: {
          clientId: matter.clientId,
          matterId: matter.id,
          internalDraftReference: draftReference(matter.accountNumber),
          officialInvoiceNumber: null,
          status: "DRAFT",
          subtotalCents,
          vatAmountCents,
          totalCents,
          currency: "ZAR",
          source: "MANUAL",
          createdById: savedActor.id,
          lines: {
            create: lines.map((line, index) => ({
              billingLineItemId: line.id,
              description: line.description,
              category: line.category,
              quantity: line.quantity,
              unitAmountCents: line.unitAmountCents,
              totalAmountCents: line.totalAmountCents,
              vatTreatment: line.vatTreatment,
              vatAmountCents: line.vatAmountCents,
              currency: "ZAR",
              position: index + 1
            }))
          }
        },
        include: { lines: true }
      });

      await tx.billingLineItem.updateMany({
        where: { id: { in: lines.map((line) => line.id) } },
        data: { status: "INVOICED" }
      });

      let statement = await tx.statementSnapshot.findFirst({
        where: { clientId: matter.clientId, matterId: null, status: "DRAFT" },
        orderBy: { createdAt: "desc" }
      });

      if (!statement) {
        statement = await tx.statementSnapshot.create({
          data: {
            clientId: matter.clientId,
            matterId: null,
            status: "DRAFT",
            openingBalanceCents: 0,
            closingBalanceCents: 0,
            currency: "ZAR",
            createdById: savedActor.id
          }
        });
      }

      const existingStatementLines = await tx.statementLine.findMany({
        where: { statementSnapshotId: statement.id },
        orderBy: [{ position: "asc" }, { id: "asc" }]
      });
      const previousBalance = existingStatementLines.at(-1)?.balanceCents ?? statement.closingBalanceCents;
      const nextBalance = previousBalance + totalCents;

      await tx.statementLine.create({
        data: {
          statementSnapshotId: statement.id,
          invoiceId: createdInvoice.id,
          description: `${matter.accountNumber} - ${createdInvoice.internalDraftReference}`,
          lineDate: new Date(),
          debitCents: totalCents,
          creditCents: 0,
          balanceCents: nextBalance,
          currency: "ZAR",
          position: existingStatementLines.length + 1
        }
      });
      await tx.statementSnapshot.update({
        where: { id: statement.id },
        data: { closingBalanceCents: nextBalance }
      });

      await tx.auditLog.create({
        data: {
          eventType: "INVOICE_CREATED",
          actorId: savedActor.id,
          targetType: "invoice",
          targetId: createdInvoice.id,
          summary: "Staging matter draft invoice created",
          metadata: {
            matterId: matter.id,
            clientId: matter.clientId,
            internalDraftReference: createdInvoice.internalDraftReference,
            statementSnapshotId: statement.id,
            totalCents
          },
          sensitive: true
        }
      });
      await tx.auditLog.create({
        data: {
          eventType: "STATEMENT_SNAPSHOT_CREATED",
          actorId: savedActor.id,
          targetType: "statement_snapshot",
          targetId: statement.id,
          summary: "Staging client draft statement updated from matter invoice",
          metadata: {
            clientId: matter.clientId,
            matterId: matter.id,
            invoiceId: createdInvoice.id,
            totalCents
          },
          sensitive: true
        }
      });
      await tx.timelineEvent.create({
        data: {
          eventType: "AUDIT_EVENT_RECORDED",
          actorId: savedActor.id,
          subjectType: "invoice",
          subjectId: createdInvoice.id,
          clientId: matter.clientId,
          matterId: matter.id,
          summary: `Draft invoice created: ${createdInvoice.internalDraftReference}`,
          metadata: {
            total: formatMoney(totalCents),
            statementSnapshotId: statement.id
          }
        }
      });

      return createdInvoice;
    });

    return serviceSuccess({
      id: invoice.id,
      internalDraftReference: invoice.internalDraftReference
    });
  } catch (error) {
    if (error instanceof Error && error.message === "MATTER_NOT_FOUND") {
      return serviceFailure({
        code: "NOT_FOUND",
        message: "Matter was not found."
      });
    }

    if (error instanceof Error && error.message === "NO_DRAFT_LINES") {
      return serviceFailure({
        code: "VALIDATION_ERROR",
        message: "Add at least one draft billing line before creating a draft invoice."
      });
    }

    return transactionFailure();
  }
}

export async function loadClientDraftStatementLines(clientId: string): Promise<readonly StagingClientStatementLine[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const prisma = await getPrismaClient() as unknown as {
      statementSnapshot: {
        findFirst(args: {
          where: { clientId: string; matterId: null; status: "DRAFT" };
          orderBy: { createdAt: "desc" };
          include: {
            lines: {
              orderBy: [{ position: "asc" }, { id: "asc" }];
              include: {
                invoice: {
                  select: {
                    internalDraftReference: true;
                    matter: {
                      select: {
                        accountNumber: true;
                      };
                    };
                  };
                };
              };
            };
          };
        }): Promise<{
          lines: Array<StagingClientStatementLine & {
            invoice?: {
              internalDraftReference: string;
              matter: {
                accountNumber: string;
              };
            } | null;
          }>;
        } | null>;
      };
    };
    const statement = await prisma.statementSnapshot.findFirst({
      where: { clientId, matterId: null, status: "DRAFT" },
      orderBy: { createdAt: "desc" },
      include: {
        lines: {
          orderBy: [{ position: "asc" }, { id: "asc" }],
          include: {
            invoice: {
              select: {
                internalDraftReference: true,
                matter: {
                  select: {
                    accountNumber: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return statement?.lines.map((line) => ({
      id: line.id,
      statementSnapshotId: line.statementSnapshotId,
      invoiceId: line.invoiceId,
      matterReference: line.invoice?.matter.accountNumber ?? null,
      draftInvoiceReference: line.invoice?.internalDraftReference ?? null,
      description: line.description,
      debitCents: line.debitCents,
      creditCents: line.creditCents,
      balanceCents: line.balanceCents,
      lineDate: line.lineDate,
      position: line.position
    })) ?? [];
  } catch {
    return [];
  }
}

export function formatDraftInvoiceMoney(amountCents: number): string {
  return formatMoney(amountCents);
}
