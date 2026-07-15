import { afterEach, describe, expect, it, vi } from "vitest";

import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import {
  getStagingBillingItemsPageState,
  listBillingItemTemplates,
  loadBillingItemTemplates,
  parseBillingItemTemplateFormData,
  saveBillingItemTemplate
} from "./staging-billing-items";

const stagingPrincipal: AuthenticatedPrincipal = {
  userId: "staging_admin_password_reviewer",
  email: "staging.admin.review@example.test",
  roles: ["READ_ONLY_REVIEWER"],
  provider: "staging_admin_password"
};

function createFakePrisma() {
  const templates: Array<{
    id: string;
    label: string;
    normalizedSearch: string;
    category: "TIME" | "DISBURSEMENT";
    description: string;
    amountCents: number;
    currency: string;
    vatTreatment: "VAT_ON_FEES" | "NO_VAT";
    status: "ACTIVE" | "ARCHIVED";
    updatedAt: Date;
  }> = [];
  const auditLogs: unknown[] = [];

  const tx = {
    user: {
      async upsert() {
        return { id: "staging_admin_password_reviewer" };
      }
    },
    billingItemTemplate: {
      async create({ data }: { data: Omit<(typeof templates)[number], "id" | "currency" | "updatedAt"> }) {
        const record = {
          id: `template_${templates.length + 1}`,
          ...data,
          currency: "ZAR",
          updatedAt: new Date("2026-07-15T09:00:00.000Z")
        };
        templates.push(record);
        return record;
      },
      async update({ where, data }: {
        where: { id: string };
        data: Omit<(typeof templates)[number], "id" | "currency" | "updatedAt">;
      }) {
        const index = templates.findIndex((template) => template.id === where.id);

        if (index < 0) {
          throw new Error("missing template");
        }

        templates[index] = {
          ...templates[index],
          ...data,
          updatedAt: new Date("2026-07-15T10:00:00.000Z")
        };
        return templates[index];
      },
      async findMany() {
        return templates;
      }
    },
    auditLog: {
      async create({ data }: { data: unknown }) {
        auditLogs.push(data);
        return data;
      }
    }
  };

  return {
    templates,
    auditLogs,
    prisma: {
      ...tx,
      async $transaction<T>(work: (scope: typeof tx) => Promise<T>) {
        return work(tx);
      }
    }
  };
}

describe("staging billing items", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.burgessPrismaClient = undefined;
  });

  it("parses form data and stores amount in integer cents", () => {
    const formData = new FormData();
    formData.set("label", "Consultation");
    formData.set("category", "TIME");
    formData.set("description", "Consultation item");
    formData.set("amountCents", "85000");
    formData.set("vatTreatment", "VAT_ON_FEES");

    expect(parseBillingItemTemplateFormData(formData)).toMatchObject({
      label: "Consultation",
      amountCents: "85000"
    });
  });

  it("fails closed when the staging billing gate is off", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await saveBillingItemTemplate({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        label: "Consultation",
        category: "TIME",
        description: "Consultation item",
        amountCents: "85000",
        vatTreatment: "VAT_ON_FEES",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_BILLING_ITEMS_ENABLED: "false"
      }
    });

    expect(result.ok).toBe(false);
    expect(fake.templates).toHaveLength(0);
  });

  it("fails closed when DATABASE_URL is missing", async () => {
    const fake = createFakePrisma();

    const result = await saveBillingItemTemplate({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        label: "Consultation",
        category: "TIME",
        description: "Consultation item",
        amountCents: "85000",
        vatTreatment: "VAT_ON_FEES",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_BILLING_ITEMS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
  });

  it("validates required billing item fields", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await saveBillingItemTemplate({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        label: "",
        category: "TIME",
        description: "",
        amountCents: "-1",
        vatTreatment: "VAT_ON_FEES",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_BILLING_ITEMS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
    expect(fake.templates).toHaveLength(0);
  });

  it("creates and audits a reusable billing template when enabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await saveBillingItemTemplate({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        label: "Consultation",
        category: "TIME",
        description: "Consultation item",
        amountCents: "85000",
        vatTreatment: "VAT_ON_FEES",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_BILLING_ITEMS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        label: "Consultation",
        amountCents: 85000
      }
    });
    expect(fake.templates).toHaveLength(1);
    expect(fake.auditLogs).toHaveLength(1);
  });

  it("updates and audits a reusable billing template when enabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.templates.push({
      id: "template_1",
      label: "Consultation",
      normalizedSearch: "consultation",
      category: "TIME",
      description: "Consultation item",
      amountCents: 85000,
      currency: "ZAR",
      vatTreatment: "VAT_ON_FEES",
      status: "ACTIVE",
      updatedAt: new Date("2026-07-15T09:00:00.000Z")
    });

    const result = await saveBillingItemTemplate({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      id: "template_1",
      input: {
        label: "Updated Consultation",
        category: "TIME",
        description: "Updated item",
        amountCents: "90000",
        vatTreatment: "NO_VAT",
        status: "ARCHIVED"
      },
      environment: {
        BURGESS_STAGING_BILLING_ITEMS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        label: "Updated Consultation",
        amountCents: 90000,
        status: "ARCHIVED"
      }
    });
    expect(fake.auditLogs).toHaveLength(1);
  });

  it("lists reusable billing templates", async () => {
    const fake = createFakePrisma();
    fake.templates.push({
      id: "template_1",
      label: "Consultation",
      normalizedSearch: "consultation",
      category: "TIME",
      description: "Consultation item",
      amountCents: 85000,
      currency: "ZAR",
      vatTreatment: "VAT_ON_FEES",
      status: "ACTIVE",
      updatedAt: new Date("2026-07-15T09:00:00.000Z")
    });

    const result = await listBillingItemTemplates({
      prisma: fake.prisma,
      activeOnly: true,
      limit: 5
    });

    expect(result).toMatchObject({
      ok: true,
      data: [
        {
          label: "Consultation"
        }
      ]
    });
  });

  it("returns repository failure when billing templates cannot be listed", async () => {
    const result = await listBillingItemTemplates({
      prisma: {
        billingItemTemplate: {
          async findMany() {
            throw new Error("database unavailable");
          }
        }
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR"
      }
    });
  });

  it("returns transaction failure when billing item save cannot commit", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    const result = await saveBillingItemTemplate({
      principal: stagingPrincipal,
      prisma: {
        async $transaction() {
          throw new Error("transaction failed");
        }
      },
      input: {
        label: "Consultation",
        category: "TIME",
        description: "Consultation item",
        amountCents: "85000",
        vatTreatment: "VAT_ON_FEES",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_BILLING_ITEMS_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });

  it("returns empty template list when DATABASE_URL is unavailable", async () => {
    await expect(loadBillingItemTemplates()).resolves.toEqual([]);
  });

  it("loads billing templates through the configured Prisma client", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.templates.push({
      id: "template_1",
      label: "Consultation",
      normalizedSearch: "consultation",
      category: "TIME",
      description: "Consultation item",
      amountCents: 85000,
      currency: "ZAR",
      vatTreatment: "VAT_ON_FEES",
      status: "ACTIVE",
      updatedAt: new Date("2026-07-15T09:00:00.000Z")
    });
    globalThis.burgessPrismaClient = fake.prisma as never;

    await expect(loadBillingItemTemplates({ activeOnly: true, limit: 5 })).resolves.toMatchObject([
      {
        label: "Consultation"
      }
    ]);
  });

  it("returns empty billing templates when the configured Prisma client fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      billingItemTemplate: {
        async findMany() {
          throw new Error("database unavailable");
        }
      }
    } as never;

    await expect(loadBillingItemTemplates()).resolves.toEqual([]);
  });

  it("reports page state from database and billing gate", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    expect(
      getStagingBillingItemsPageState(stagingPrincipal, {
        BURGESS_STAGING_BILLING_ITEMS_ENABLED: "true"
      })
    ).toEqual({
      databaseAvailable: true,
      writesEnabled: true
    });
  });
});
