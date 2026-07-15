import { afterEach, describe, expect, it, vi } from "vitest";

import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import {
  addMatterDraftBillingLine,
  createMatterDraftInvoice,
  formatDraftInvoiceMoney,
  loadClientDraftStatementLines,
  loadMatterBillingLines,
  loadMatterDraftInvoices,
  listMatterBillingLines,
  listMatterDraftInvoices,
  parseMatterBillingLineFormData
} from "./staging-matter-invoices";

const stagingPrincipal: AuthenticatedPrincipal = {
  userId: "staging_admin_password_reviewer",
  email: "staging.admin.review@example.test",
  roles: ["READ_ONLY_REVIEWER"],
  provider: "staging_admin_password"
};

function createFakePrisma() {
  const matters = [{
    id: "matter_1",
    clientId: "client_1",
    accountNumber: "TEST-MATTER-001",
    name: "TEST Matter"
  }];
  const billingLines: Array<{
    id: string;
    matterId: string;
    description: string;
    category: "TIME" | "DISBURSEMENT";
    status: "DRAFT" | "INVOICED";
    quantity: number;
    unitAmountCents: number;
    totalAmountCents: number;
    currency: string;
    vatTreatment: "VAT_ON_FEES" | "NO_VAT";
    vatAmountCents: number;
    createdAt: Date;
  }> = [];
  const invoices: Array<{
    id: string;
    clientId: string;
    matterId: string;
    internalDraftReference: string;
    officialInvoiceNumber: null;
    status: "DRAFT";
    subtotalCents: number;
    vatAmountCents: number;
    totalCents: number;
    currency: string;
    createdAt: Date;
    lines: Array<{
      id: string;
      description: string;
      totalAmountCents: number;
      vatAmountCents: number;
    }>;
  }> = [];
  const statements: Array<{
    id: string;
    clientId: string;
    matterId: null;
    status: "DRAFT";
    closingBalanceCents: number;
    currency: string;
  }> = [];
  const statementLines: Array<{
    statementSnapshotId: string;
    invoiceId: string;
    description: string;
    debitCents: number;
    creditCents: 0;
    balanceCents: number;
    position: number;
  }> = [];
  const auditLogs: unknown[] = [];
  const timelineEvents: unknown[] = [];

  const tx = {
    user: {
      async upsert() {
        return { id: "staging_admin_password_reviewer" };
      }
    },
    matter: {
      async findUnique({ where }: { where: { id: string } }) {
        return matters.find((matter) => matter.id === where.id) ?? null;
      }
    },
    billingLineItem: {
      async create({ data }: { data: Omit<(typeof billingLines)[number], "id" | "createdAt"> }) {
        const record = {
          id: `billing_line_${billingLines.length + 1}`,
          ...data,
          createdAt: new Date("2026-07-15T09:00:00.000Z")
        };
        billingLines.push(record);
        return record;
      },
      async findMany({ where }: { where: { matterId: string; status?: "DRAFT" } }) {
        return billingLines.filter((line) => {
          if (line.matterId !== where.matterId) {
            return false;
          }

          return where.status ? line.status === where.status : true;
        });
      },
      async updateMany({ where, data }: { where: { id: { in: string[] } }; data: { status: "INVOICED" } }) {
        let count = 0;

        for (const line of billingLines) {
          if (where.id.in.includes(line.id)) {
            line.status = data.status;
            count += 1;
          }
        }

        return { count };
      }
    },
    invoice: {
      async create({ data }: { data: {
        clientId: string;
        matterId: string;
        internalDraftReference: string;
        officialInvoiceNumber: null;
        status: "DRAFT";
        subtotalCents: number;
        vatAmountCents: number;
        totalCents: number;
        currency: "ZAR";
        lines: {
          create: Array<{
            description: string;
            totalAmountCents: number;
            vatAmountCents: number;
          }>;
        };
      } }) {
        const record = {
          id: `invoice_${invoices.length + 1}`,
          clientId: data.clientId,
          matterId: data.matterId,
          internalDraftReference: data.internalDraftReference,
          officialInvoiceNumber: data.officialInvoiceNumber,
          status: data.status,
          subtotalCents: data.subtotalCents,
          vatAmountCents: data.vatAmountCents,
          totalCents: data.totalCents,
          currency: data.currency,
          createdAt: new Date("2026-07-15T10:00:00.000Z"),
          lines: data.lines.create.map((line, index) => ({
            id: `invoice_line_${index + 1}`,
            description: line.description,
            totalAmountCents: line.totalAmountCents,
            vatAmountCents: line.vatAmountCents
          }))
        };
        invoices.push(record);
        return record;
      },
      async findMany({ where }: { where: { matterId: string } }) {
        return invoices.filter((invoice) => invoice.matterId === where.matterId);
      }
    },
    statementSnapshot: {
      async findFirst({ where }: { where: { clientId: string } }) {
        return statements.find((statement) => statement.clientId === where.clientId) ?? null;
      },
      async create({ data }: { data: {
        clientId: string;
        matterId: null;
        status: "DRAFT";
        closingBalanceCents: number;
        currency: "ZAR";
      } }) {
        const record = {
          id: `statement_${statements.length + 1}`,
          clientId: data.clientId,
          matterId: data.matterId,
          status: data.status,
          closingBalanceCents: data.closingBalanceCents,
          currency: data.currency
        };
        statements.push(record);
        return record;
      },
      async update({ where, data }: { where: { id: string }; data: { closingBalanceCents: number } }) {
        const statement = statements.find((record) => record.id === where.id);

        if (statement) {
          statement.closingBalanceCents = data.closingBalanceCents;
        }

        return statement;
      }
    },
    statementLine: {
      async findMany({ where }: { where: { statementSnapshotId: string } }) {
        return statementLines.filter((line) => line.statementSnapshotId === where.statementSnapshotId);
      },
      async create({ data }: { data: (typeof statementLines)[number] }) {
        statementLines.push(data);
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
    matters,
    billingLines,
    invoices,
    statements,
    statementLines,
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

describe("staging matter invoices", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    Object.defineProperty(globalThis, "burgessPrismaClient", {
      configurable: true,
      value: undefined,
      writable: true
    });
  });

  it("parses matter billing line form data as integer cents", () => {
    const formData = new FormData();
    formData.set("matterId", "matter_1");
    formData.set("description", "Consultation");
    formData.set("category", "TIME");
    formData.set("quantity", "2");
    formData.set("unitAmountCents", "85000");
    formData.set("vatTreatment", "VAT_ON_FEES");

    expect(parseMatterBillingLineFormData(formData)).toMatchObject({
      matterId: "matter_1",
      quantity: "2",
      unitAmountCents: "85000"
    });
  });

  it("uses safe billing line form defaults when optional fields are missing", () => {
    const formData = new FormData();

    expect(parseMatterBillingLineFormData(formData)).toMatchObject({
      matterId: "",
      category: "TIME",
      quantity: "1",
      unitAmountCents: "0",
      vatTreatment: "VAT_ON_FEES"
    });
  });

  it("fails closed when invoice gate is off", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await addMatterDraftBillingLine({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "matter_1",
        description: "Consultation",
        category: "TIME",
        quantity: "1",
        unitAmountCents: "85000",
        vatTreatment: "VAT_ON_FEES"
      },
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "false"
      }
    });

    expect(result.ok).toBe(false);
    expect(fake.billingLines).toHaveLength(0);
  });

  it("fails closed when DATABASE_URL is missing", async () => {
    const fake = createFakePrisma();

    const result = await addMatterDraftBillingLine({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "matter_1",
        description: "Consultation",
        category: "TIME",
        quantity: "1",
        unitAmountCents: "85000",
        vatTreatment: "VAT_ON_FEES"
      },
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
  });

  it("validates draft billing line fields", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await addMatterDraftBillingLine({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "matter_1",
        description: "",
        category: "TIME",
        quantity: "0",
        unitAmountCents: "-1",
        vatTreatment: "VAT_ON_FEES"
      },
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });

  it("creates and audits a draft matter billing line", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await addMatterDraftBillingLine({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "matter_1",
        description: "Consultation",
        category: "TIME",
        quantity: "1",
        unitAmountCents: "85000",
        vatTreatment: "VAT_ON_FEES"
      },
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({ ok: true });
    expect(fake.billingLines).toMatchObject([{
      description: "Consultation",
      totalAmountCents: 85000,
      vatAmountCents: 12750
    }]);
    expect(fake.auditLogs).toHaveLength(1);
    expect(fake.timelineEvents).toHaveLength(1);
  });

  it("returns not found when adding a billing line for a missing matter", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.matters.splice(0);

    const result = await addMatterDraftBillingLine({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        matterId: "missing_matter",
        description: "Consultation",
        category: "TIME",
        quantity: "1",
        unitAmountCents: "85000",
        vatTreatment: "NO_VAT"
      },
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("returns transaction failure when billing line persistence fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    const brokenPrisma = {
      ...fake.prisma,
      async $transaction() {
        throw new Error("database unavailable");
      }
    };

    const result = await addMatterDraftBillingLine({
      principal: stagingPrincipal,
      prisma: brokenPrisma,
      input: {
        matterId: "matter_1",
        description: "Consultation",
        category: "TIME",
        quantity: "1",
        unitAmountCents: "85000",
        vatTreatment: "VAT_ON_FEES"
      },
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });

  it("creates a draft invoice and client statement line from draft billing lines", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.billingLines.push({
      id: "billing_line_1",
      matterId: "matter_1",
      description: "Consultation",
      category: "TIME",
      status: "DRAFT",
      quantity: 1,
      unitAmountCents: 85000,
      totalAmountCents: 85000,
      currency: "ZAR",
      vatTreatment: "VAT_ON_FEES",
      vatAmountCents: 12750,
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });

    const result = await createMatterDraftInvoice({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "matter_1",
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({ ok: true });
    expect(fake.billingLines[0]?.status).toBe("INVOICED");
    expect(fake.invoices).toHaveLength(1);
    expect(fake.invoices[0]).toMatchObject({
      officialInvoiceNumber: null,
      status: "DRAFT",
      subtotalCents: 85000,
      vatAmountCents: 12750,
      totalCents: 97750
    });
    expect(fake.statements).toMatchObject([{ closingBalanceCents: 97750 }]);
    expect(fake.statementLines).toMatchObject([{ debitCents: 97750, balanceCents: 97750 }]);
    expect(fake.auditLogs).toHaveLength(2);
    expect(fake.timelineEvents).toHaveLength(1);
  });

  it("fails draft invoice creation when no draft billing lines exist", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createMatterDraftInvoice({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "matter_1",
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
    expect(fake.invoices).toHaveLength(0);
  });

  it("fails draft invoice creation when invoice gate is off", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createMatterDraftInvoice({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "matter_1",
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "false"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "UNAUTHORIZED"
      }
    });
  });

  it("fails draft invoice creation when DATABASE_URL is missing", async () => {
    const fake = createFakePrisma();

    const result = await createMatterDraftInvoice({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "matter_1",
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
  });

  it("returns not found when creating a draft invoice for a missing matter", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.matters.splice(0);

    const result = await createMatterDraftInvoice({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      matterId: "missing_matter",
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("returns transaction failure when draft invoice persistence fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    const brokenPrisma = {
      ...fake.prisma,
      async $transaction() {
        throw new Error("database unavailable");
      }
    };

    const result = await createMatterDraftInvoice({
      principal: stagingPrincipal,
      prisma: brokenPrisma,
      matterId: "matter_1",
      environment: {
        BURGESS_STAGING_MATTER_INVOICES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });

  it("lists matter billing lines and draft invoices", async () => {
    const fake = createFakePrisma();
    fake.billingLines.push({
      id: "billing_line_1",
      matterId: "matter_1",
      description: "Consultation",
      category: "TIME",
      status: "DRAFT",
      quantity: 1,
      unitAmountCents: 85000,
      totalAmountCents: 85000,
      currency: "ZAR",
      vatTreatment: "VAT_ON_FEES",
      vatAmountCents: 12750,
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });
    fake.invoices.push({
      id: "invoice_1",
      clientId: "client_1",
      matterId: "matter_1",
      internalDraftReference: "DRAFT-TEST-MATTER-001-20260715-ABC123",
      officialInvoiceNumber: null,
      status: "DRAFT",
      subtotalCents: 85000,
      vatAmountCents: 12750,
      totalCents: 97750,
      currency: "ZAR",
      createdAt: new Date("2026-07-15T10:00:00.000Z"),
      lines: []
    });

    await expect(listMatterBillingLines({
      prisma: fake.prisma,
      matterId: "matter_1"
    })).resolves.toMatchObject({
      ok: true,
      data: [{ description: "Consultation" }]
    });
    await expect(listMatterDraftInvoices({
      prisma: fake.prisma,
      matterId: "matter_1"
    })).resolves.toMatchObject({
      ok: true,
      data: [{ internalDraftReference: "DRAFT-TEST-MATTER-001-20260715-ABC123" }]
    });
  });

  it("returns repository failures when listing billing lines or invoices fails", async () => {
    const brokenPrisma = {
      billingLineItem: {
        async findMany() {
          throw new Error("repository unavailable");
        }
      },
      invoice: {
        async findMany() {
          throw new Error("repository unavailable");
        }
      }
    };

    await expect(listMatterBillingLines({
      prisma: brokenPrisma,
      matterId: "matter_1"
    })).resolves.toMatchObject({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR"
      }
    });
    await expect(listMatterDraftInvoices({
      prisma: brokenPrisma,
      matterId: "matter_1"
    })).resolves.toMatchObject({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR"
      }
    });
  });

  it("loads no matter invoice data when DATABASE_URL is missing", async () => {
    await expect(loadMatterBillingLines("matter_1")).resolves.toEqual([]);
    await expect(loadMatterDraftInvoices("matter_1")).resolves.toEqual([]);
    await expect(loadClientDraftStatementLines("client_1")).resolves.toEqual([]);
  });

  it("loads matter billing lines and draft invoices through the configured Prisma client", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.billingLines.push({
      id: "billing_line_1",
      matterId: "matter_1",
      description: "Consultation",
      category: "TIME",
      status: "DRAFT",
      quantity: 1,
      unitAmountCents: 85000,
      totalAmountCents: 85000,
      currency: "ZAR",
      vatTreatment: "VAT_ON_FEES",
      vatAmountCents: 12750,
      createdAt: new Date("2026-07-15T09:00:00.000Z")
    });
    fake.invoices.push({
      id: "invoice_1",
      clientId: "client_1",
      matterId: "matter_1",
      internalDraftReference: "DRAFT-TEST-MATTER-001-20260715-ABC123",
      officialInvoiceNumber: null,
      status: "DRAFT",
      subtotalCents: 85000,
      vatAmountCents: 12750,
      totalCents: 97750,
      currency: "ZAR",
      createdAt: new Date("2026-07-15T10:00:00.000Z"),
      lines: []
    });
    globalThis.burgessPrismaClient = fake.prisma as never;

    await expect(loadMatterBillingLines("matter_1")).resolves.toMatchObject([
      { description: "Consultation" }
    ]);
    await expect(loadMatterDraftInvoices("matter_1")).resolves.toMatchObject([
      { internalDraftReference: "DRAFT-TEST-MATTER-001-20260715-ABC123" }
    ]);
  });

  it("falls back to empty matter invoice lists when the configured Prisma client fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      billingLineItem: {
        async findMany() {
          throw new Error("repository unavailable");
        }
      },
      invoice: {
        async findMany() {
          throw new Error("repository unavailable");
        }
      }
    } as never;

    await expect(loadMatterBillingLines("matter_1")).resolves.toEqual([]);
    await expect(loadMatterDraftInvoices("matter_1")).resolves.toEqual([]);
  });

  it("falls back to empty matter invoice lists when Prisma client resolution fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    Object.defineProperty(globalThis, "burgessPrismaClient", {
      configurable: true,
      get() {
        throw new Error("client resolution failed");
      }
    });

    await expect(loadMatterBillingLines("matter_1")).resolves.toEqual([]);
    await expect(loadMatterDraftInvoices("matter_1")).resolves.toEqual([]);
  });

  it("loads client draft statement lines from the configured Prisma client", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      statementSnapshot: {
        async findFirst() {
          return {
            lines: [{
              id: "statement_line_1",
              statementSnapshotId: "statement_1",
              invoiceId: "invoice_1",
              description: "TEST-MATTER-001 - DRAFT-TEST-MATTER-001-20260715-ABC123",
              debitCents: 97750,
              creditCents: 0,
              balanceCents: 97750,
              lineDate: new Date("2026-07-15T11:00:00.000Z"),
              position: 1,
              invoice: {
                internalDraftReference: "DRAFT-TEST-MATTER-001-20260715-ABC123",
                matter: {
                  accountNumber: "TEST-MATTER-001"
                }
              }
            }]
          };
        }
      }
    } as never;

    await expect(loadClientDraftStatementLines("client_1")).resolves.toMatchObject([{
      matterReference: "TEST-MATTER-001",
      draftInvoiceReference: "DRAFT-TEST-MATTER-001-20260715-ABC123",
      debitCents: 97750,
      balanceCents: 97750
    }]);
  });

  it("returns empty client statement lines when no draft statement exists", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      statementSnapshot: {
        async findFirst() {
          return null;
        }
      }
    } as never;

    await expect(loadClientDraftStatementLines("client_1")).resolves.toEqual([]);
  });

  it("maps client statement lines without invoice links as draft-safe null references", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      statementSnapshot: {
        async findFirst() {
          return {
            lines: [{
              id: "statement_line_1",
              statementSnapshotId: "statement_1",
              invoiceId: null,
              description: "Opening balance adjustment",
              debitCents: 0,
              creditCents: 0,
              balanceCents: 0,
              lineDate: null,
              position: 1,
              invoice: null
            }]
          };
        }
      }
    } as never;

    await expect(loadClientDraftStatementLines("client_1")).resolves.toMatchObject([{
      matterReference: null,
      draftInvoiceReference: null,
      description: "Opening balance adjustment"
    }]);
  });

  it("falls back to empty client statement lines when lookup fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      statementSnapshot: {
        async findFirst() {
          throw new Error("repository unavailable");
        }
      }
    } as never;

    await expect(loadClientDraftStatementLines("client_1")).resolves.toEqual([]);
  });

  it("formats draft invoice money in integer cents", () => {
    expect(formatDraftInvoiceMoney(97750)).toBe("R 977,50");
  });
});
