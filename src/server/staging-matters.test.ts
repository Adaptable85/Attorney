import { afterEach, describe, expect, it, vi } from "vitest";

import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import {
  createStagingMatter,
  getStagingMatter,
  getStagingMatterPageState,
  listStagingMatters,
  loadStagingMatter,
  loadStagingMatters,
  parseMatterCreateFormData,
  validateMatterCreateFormInput
} from "./staging-matters";

const stagingPrincipal: AuthenticatedPrincipal = {
  userId: "staging_admin_password_reviewer",
  email: "staging.admin.review@example.test",
  roles: ["READ_ONLY_REVIEWER"],
  provider: "staging_admin_password"
};

function createFakePrisma() {
  const clients = [{ id: "client_1", displayName: "TEST Client" }];
  const matters: Array<{
    id: string;
    clientId: string;
    clientDisplayName?: string;
    accountNumber: string;
    normalizedSearch: string;
    name: string;
    description: string;
    type: "OTHER" | "CONTRACTS";
    status: "OPEN" | "PENDING" | "ARCHIVED";
    nextStepDueDate: Date | null;
    updatedAt: Date;
    client?: { displayName: string };
  }> = [];
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
    matter: {
      async create({ data }: { data: Omit<(typeof matters)[number], "id" | "updatedAt" | "client"> }) {
        const client = clients.find((record) => record.id === data.clientId);
        const record = {
          id: `matter_${matters.length + 1}`,
          ...data,
          nextStepDueDate: data.nextStepDueDate ?? null,
          updatedAt: new Date("2026-07-15T09:00:00.000Z"),
          client: client ? { displayName: client.displayName } : undefined
        };
        matters.push(record);
        return record;
      },
      async findMany({ where }: { where: { clientId?: string } }) {
        return matters
          .filter((matter) => matter.status !== "ARCHIVED")
          .filter((matter) => !where.clientId || matter.clientId === where.clientId);
      },
      async findUnique({ where }: { where: { id: string } }) {
        return matters.find((matter) => matter.id === where.id) ?? null;
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

describe("staging matters", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.burgessPrismaClient = undefined;
  });

  it("parses and validates matter form input", () => {
    const formData = new FormData();
    formData.set("clientId", "client_1");
    formData.set("accountNumber", "TEST-MATTER-001");
    formData.set("name", "TEST Matter - Delete Later");
    formData.set("description", "Staging matter test");
    formData.set("type", "OTHER");

    expect(parseMatterCreateFormData(formData)).toMatchObject({
      clientId: "client_1",
      type: "OTHER"
    });
    expect(validateMatterCreateFormInput(parseMatterCreateFormData(formData))).toMatchObject({
      ok: true,
      data: {
        status: "OPEN"
      }
    });
  });

  it("ignores invalid optional next due dates", () => {
    const result = validateMatterCreateFormInput({
      clientId: "client_1",
      accountNumber: "TEST-MATTER-001",
      name: "TEST Matter - Delete Later",
      description: "Staging matter test",
      type: "OTHER",
      nextStepDueDate: "not-a-date"
    });

    expect(result.ok).toBe(true);
    expect(result.ok && "nextStepDueDate" in result.data).toBe(false);
  });

  it("fails closed when the matter gate is off", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createStagingMatter({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        clientId: "client_1",
        accountNumber: "TEST-MATTER-001",
        name: "TEST Matter - Delete Later",
        description: "Staging matter test",
        type: "OTHER"
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "false"
      }
    });

    expect(result.ok).toBe(false);
    expect(fake.matters).toHaveLength(0);
  });

  it("fails closed when DATABASE_URL is missing", async () => {
    const fake = createFakePrisma();

    const result = await createStagingMatter({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        clientId: "client_1",
        accountNumber: "TEST-MATTER-001",
        name: "TEST Matter - Delete Later",
        description: "Staging matter test",
        type: "OTHER"
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
  });

  it("validates required fields", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createStagingMatter({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        clientId: "client_1",
        accountNumber: "",
        name: "",
        description: "",
        type: "NOT_A_TYPE" as never
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
  });

  it("creates matter, audit log and timeline event when enabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createStagingMatter({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        clientId: "client_1",
        accountNumber: "TEST-MATTER-001",
        name: "TEST Matter - Delete Later",
        description: "Staging matter test",
        type: "OTHER",
        nextStepDueDate: "2026-07-30"
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        accountNumber: "TEST-MATTER-001",
        name: "TEST Matter - Delete Later"
      }
    });
    expect(fake.matters).toHaveLength(1);
    expect(fake.auditLogs).toHaveLength(1);
    expect(fake.timelineEvents).toHaveLength(1);
  });

  it("creates a matter without an optional next due date", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createStagingMatter({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        clientId: "client_1",
        accountNumber: "TEST-MATTER-002",
        name: "TEST Matter Without Date",
        description: "Staging matter test",
        type: "OTHER"
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result.ok).toBe(true);
    expect(fake.matters[0]?.nextStepDueDate).toBeNull();
  });

  it("returns not found when the client file is missing", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createStagingMatter({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        clientId: "missing_client",
        accountNumber: "TEST-MATTER-001",
        name: "TEST Matter - Delete Later",
        description: "Staging matter test",
        type: "OTHER"
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("lists matters for the selected client only", async () => {
    const fake = createFakePrisma();
    fake.matters.push(
      {
        id: "matter_1",
        clientId: "client_1",
        accountNumber: "TEST-MATTER-001",
        normalizedSearch: "test",
        name: "Visible matter",
        description: "Visible",
        type: "OTHER",
        status: "OPEN",
        nextStepDueDate: null,
        updatedAt: new Date("2026-07-15T09:00:00.000Z"),
        client: { displayName: "TEST Client" }
      },
      {
        id: "matter_2",
        clientId: "client_2",
        accountNumber: "TEST-MATTER-002",
        normalizedSearch: "test",
        name: "Hidden matter",
        description: "Hidden",
        type: "OTHER",
        status: "OPEN",
        nextStepDueDate: null,
        updatedAt: new Date("2026-07-15T09:00:00.000Z"),
        client: { displayName: "Other Client" }
      }
    );

    const result = await listStagingMatters({
      prisma: fake.prisma,
      clientId: "client_1"
    });

    expect(result).toMatchObject({
      ok: true,
      data: [
        {
          id: "matter_1",
          name: "Visible matter"
        }
      ]
    });
  });

  it("lists matters with search and custom limits", async () => {
    const fake = createFakePrisma();
    fake.matters.push({
      id: "matter_1",
      clientId: "client_1",
      accountNumber: "TEST-MATTER-001",
      normalizedSearch: "visible matter test-matter-001",
      name: "Visible matter",
      description: "Visible",
      type: "OTHER",
      status: "OPEN",
      nextStepDueDate: null,
      updatedAt: new Date("2026-07-15T09:00:00.000Z"),
      client: { displayName: "TEST Client" }
    });

    const result = await listStagingMatters({
      prisma: fake.prisma,
      query: "visible",
      limit: 5
    });

    expect(result).toMatchObject({
      ok: true,
      data: [
        {
          name: "Visible matter"
        }
      ]
    });
  });

  it("returns repository failure when matters cannot be listed", async () => {
    const result = await listStagingMatters({
      prisma: {
        matter: {
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

  it("loads a staging matter by id", async () => {
    const fake = createFakePrisma();
    fake.matters.push({
      id: "matter_1",
      clientId: "client_1",
      accountNumber: "TEST-MATTER-001",
      normalizedSearch: "visible matter test-matter-001",
      name: "Visible matter",
      description: "Visible",
      type: "OTHER",
      status: "OPEN",
      nextStepDueDate: null,
      updatedAt: new Date("2026-07-15T09:00:00.000Z"),
      client: { displayName: "TEST Client" }
    });

    const result = await getStagingMatter({
      prisma: fake.prisma,
      id: "matter_1"
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        name: "Visible matter"
      }
    });
  });

  it("returns not found when staging matter is missing", async () => {
    const fake = createFakePrisma();

    const result = await getStagingMatter({
      prisma: fake.prisma,
      id: "missing"
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("returns repository failure when staging matter lookup fails", async () => {
    const result = await getStagingMatter({
      prisma: {
        matter: {
          async findUnique() {
            throw new Error("database unavailable");
          }
        }
      },
      id: "matter_1"
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR"
      }
    });
  });

  it("returns transaction failure when matter creation cannot commit", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    const result = await createStagingMatter({
      principal: stagingPrincipal,
      prisma: {
        async $transaction() {
          throw new Error("transaction failed");
        }
      },
      input: {
        clientId: "client_1",
        accountNumber: "TEST-MATTER-001",
        name: "TEST Matter - Delete Later",
        description: "Staging matter test",
        type: "OTHER"
      },
      environment: {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });

  it("returns empty matters when DATABASE_URL is unavailable", async () => {
    await expect(loadStagingMatters({ clientId: "client_1" })).resolves.toEqual([]);
    await expect(loadStagingMatter("matter_1")).resolves.toBeNull();
  });

  it("loads matters through the configured Prisma client", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();
    fake.matters.push({
      id: "matter_1",
      clientId: "client_1",
      accountNumber: "TEST-MATTER-001",
      normalizedSearch: "visible matter test-matter-001",
      name: "Visible matter",
      description: "Visible",
      type: "OTHER",
      status: "OPEN",
      nextStepDueDate: null,
      updatedAt: new Date("2026-07-15T09:00:00.000Z"),
      client: { displayName: "TEST Client" }
    });
    globalThis.burgessPrismaClient = fake.prisma as never;

    await expect(loadStagingMatters({ clientId: "client_1" })).resolves.toMatchObject([
      {
        name: "Visible matter"
      }
    ]);
    await expect(loadStagingMatter("matter_1")).resolves.toMatchObject({
      name: "Visible matter"
    });
  });

  it("returns safe empty values when configured Prisma client fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      matter: {
        async findMany() {
          throw new Error("database unavailable");
        },
        async findUnique() {
          throw new Error("database unavailable");
        }
      }
    } as never;

    await expect(loadStagingMatters({ clientId: "client_1" })).resolves.toEqual([]);
    await expect(loadStagingMatter("matter_1")).resolves.toBeNull();
  });

  it("reports matter page state from database and gate checks", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    expect(
      getStagingMatterPageState(stagingPrincipal, {
        BURGESS_STAGING_MATTER_WRITES_ENABLED: "true"
      })
    ).toEqual({
      databaseAvailable: true,
      writesEnabled: true
    });
  });
});
