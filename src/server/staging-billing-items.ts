import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { evaluateStagingBillingItemsGate } from "@/config/staging-admin-live-gates";
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
const billingTemplateStatusSchema = z.enum(["ACTIVE", "ARCHIVED"]);

const billingItemTemplateSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(100),
  category: billingCategorySchema,
  description: z.string().trim().min(1, "Description is required").max(500),
  amountCents: z.coerce.number().int().min(0, "Amount must be zero or greater"),
  vatTreatment: vatTreatmentSchema,
  status: billingTemplateStatusSchema.default("ACTIVE")
});

export type BillingItemTemplateFormInput = z.input<typeof billingItemTemplateSchema>;
export type BillingItemTemplateListItem = {
  id: string;
  label: string;
  category: z.output<typeof billingCategorySchema>;
  description: string;
  amountCents: number;
  currency: string;
  vatTreatment: z.output<typeof vatTreatmentSchema>;
  status: z.output<typeof billingTemplateStatusSchema>;
  updatedAt: Date;
};

type BillingTemplateTransaction = {
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
  billingItemTemplate: {
    create(args: {
      data: {
        label: string;
        normalizedSearch: string;
        category: BillingItemTemplateListItem["category"];
        description: string;
        amountCents: number;
        vatTreatment: BillingItemTemplateListItem["vatTreatment"];
        status: BillingItemTemplateListItem["status"];
      };
    }): Promise<BillingItemTemplateListItem>;
    update(args: {
      where: { id: string };
      data: {
        label: string;
        normalizedSearch: string;
        category: BillingItemTemplateListItem["category"];
        description: string;
        amountCents: number;
        vatTreatment: BillingItemTemplateListItem["vatTreatment"];
        status: BillingItemTemplateListItem["status"];
      };
    }): Promise<BillingItemTemplateListItem>;
    findMany(args: {
      where?: {
        status?: "ACTIVE";
      };
      orderBy: [{ status: "asc" }, { label: "asc" }];
      take?: number;
    }): Promise<BillingItemTemplateListItem[]>;
  };
  auditLog: {
    create(args: {
      data: {
        eventType: "BILLING_LINE_ITEM_CREATED" | "BILLING_LINE_ITEM_EDITED";
        actorId: string;
        targetType: "billing_item_template";
        targetId: string;
        summary: string;
        metadata: Record<string, unknown>;
        sensitive: true;
      };
    }): Promise<unknown>;
  };
};

type BillingTemplatePrisma = BillingTemplateTransaction & {
  $transaction<T>(work: (tx: BillingTemplateTransaction) => Promise<T>): Promise<T>;
};

function actorData(principal: AuthenticatedPrincipal | null) {
  return {
    id: principal?.userId ?? "staging_admin_password_reviewer",
    email: principal?.email ?? "staging.admin.review@example.test",
    name: "Staging Admin Password Reviewer"
  };
}

function normalized(value: string): string {
  return value.trim().toLowerCase();
}

function validationFailure(error: ZodError): ServiceResult<never> {
  return serviceFailure({
    code: "VALIDATION_ERROR",
    message: "Billing item input failed validation.",
    fieldErrors: error.flatten().fieldErrors
  });
}

export function parseBillingItemTemplateFormData(formData: FormData): BillingItemTemplateFormInput {
  return {
    label: String(formData.get("label") ?? ""),
    category: String(formData.get("category") ?? "TIME") as BillingItemTemplateFormInput["category"],
    description: String(formData.get("description") ?? ""),
    amountCents: String(formData.get("amountCents") ?? "0"),
    vatTreatment: String(formData.get("vatTreatment") ?? "VAT_ON_FEES") as BillingItemTemplateFormInput["vatTreatment"],
    status: String(formData.get("status") ?? "ACTIVE") as BillingItemTemplateFormInput["status"]
  };
}

export function formatBillingCategory(category: BillingItemTemplateListItem["category"]): string {
  return category
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function formatVatTreatment(treatment: BillingItemTemplateListItem["vatTreatment"]): string {
  return treatment
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function formatRandFromCents(amountCents: number): string {
  return `R ${(amountCents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export async function listBillingItemTemplates(options: {
  prisma: unknown;
  activeOnly?: boolean;
  limit?: number;
}): Promise<ServiceResult<readonly BillingItemTemplateListItem[]>> {
  const prisma = options.prisma as BillingTemplatePrisma;

  try {
    const records = await prisma.billingItemTemplate.findMany({
      ...(options.activeOnly ? { where: { status: "ACTIVE" } } : {}),
      orderBy: [{ status: "asc" }, { label: "asc" }],
      ...(options.limit ? { take: options.limit } : {})
    });

    return serviceSuccess(records);
  } catch {
    return repositoryFailure();
  }
}

export async function loadBillingItemTemplates(options: {
  activeOnly?: boolean;
  limit?: number;
} = {}): Promise<readonly BillingItemTemplateListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const result = await listBillingItemTemplates({
      prisma: await getPrismaClient(),
      ...options
    });

    return result.ok ? result.data : [];
  } catch {
    return [];
  }
}

export async function saveBillingItemTemplate(options: {
  principal: AuthenticatedPrincipal | null;
  prisma: unknown;
  input: BillingItemTemplateFormInput;
  id?: string;
  environment?: Partial<Record<string, string | undefined>>;
}): Promise<ServiceResult<BillingItemTemplateListItem>> {
  if (!hasDatabaseUrl()) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "DATABASE_URL is required before billing items can be saved."
    });
  }

  const gate = evaluateStagingBillingItemsGate(options.principal, options.environment);

  if (!gate.enabled) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Staging billing item edits are not enabled for this session."
    });
  }

  let parsed: z.output<typeof billingItemTemplateSchema>;

  try {
    parsed = billingItemTemplateSchema.parse(options.input);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure(error);
    }

    return repositoryFailure();
  }

  const prisma = options.prisma as BillingTemplatePrisma;
  const actor = actorData(options.principal);
  const data = {
    label: parsed.label,
    normalizedSearch: normalized(parsed.label),
    category: parsed.category,
    description: parsed.description,
    amountCents: parsed.amountCents,
    vatTreatment: parsed.vatTreatment,
    status: parsed.status
  };

  try {
    const saved = await prisma.$transaction(async (tx) => {
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
      const template = options.id
        ? await tx.billingItemTemplate.update({
            where: { id: options.id },
            data
          })
        : await tx.billingItemTemplate.create({
            data
          });

      await tx.auditLog.create({
        data: {
          eventType: options.id ? "BILLING_LINE_ITEM_EDITED" : "BILLING_LINE_ITEM_CREATED",
          actorId: savedActor.id,
          targetType: "billing_item_template",
          targetId: template.id,
          summary: options.id
            ? "Staging reusable billing item edited"
            : "Staging reusable billing item created",
          metadata: {
            source: "staging-billing-item-template-form",
            label: template.label,
            category: template.category,
            amountCents: template.amountCents,
            vatTreatment: template.vatTreatment,
            status: template.status
          },
          sensitive: true
        }
      });

      return template;
    });

    return serviceSuccess(saved);
  } catch {
    return transactionFailure();
  }
}

export function getStagingBillingItemsPageState(
  principal: AuthenticatedPrincipal | null,
  environment: Partial<Record<string, string | undefined>> = process.env
) {
  const gate = evaluateStagingBillingItemsGate(principal, environment);

  return {
    databaseAvailable: hasDatabaseUrl(),
    writesEnabled: gate.enabled
  };
}
