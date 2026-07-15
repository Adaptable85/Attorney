import { afterEach, describe, expect, it, vi } from "vitest";

import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import {
  createStagingClientFile,
  databaseStatus,
  getStagingClientFile,
  getStagingClientFilePageState,
  loadStagingClientFileDetail,
  loadStagingClientFileList,
  listStagingClientFiles,
  parseClientFileFormData,
  validateClientFileFormInput
} from "./staging-client-files";

const stagingPrincipal: AuthenticatedPrincipal = {
  userId: "staging_admin_password_reviewer",
  email: "staging.admin.review@example.test",
  roles: ["READ_ONLY_REVIEWER"],
  provider: "staging_admin_password"
};

function createFakePrisma() {
  const clients: Array<{
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
  }> = [];
  const contacts: Array<{ id: string; clientId: string; name: string; email?: string; phone?: string }> = [];
  const auditLogs: unknown[] = [];
  const timelineEvents: unknown[] = [];

  const tx = {
    user: {
      async upsert() {
        return { id: "staging_admin_password_reviewer" };
      }
    },
    client: {
      async create({ data }: { data: {
        accountNumber: string;
        displayName: string;
        normalizedSearch: string;
        status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
      } }) {
        const record = {
          id: `client_${clients.length + 1}`,
          ...data,
          primaryContactId: null,
          updatedAt: new Date("2026-07-15T09:00:00.000Z"),
          primaryContact: null
        };
        clients.push(record);
        return record;
      },
      async update({ where, data }: { where: { id: string }; data: { primaryContactId: string } }) {
        const client = clients.find((record) => record.id === where.id);

        if (!client) {
          throw new Error("missing client");
        }

        client.primaryContactId = data.primaryContactId;
        const contact = contacts.find((record) => record.id === data.primaryContactId);
        client.primaryContact = contact
          ? {
              name: contact.name,
              email: contact.email ?? null,
              phone: contact.phone ?? null
            }
          : null;
        return client;
      },
      async findMany({ where }: { where: {
        OR?: Array<{
          normalizedSearch?: { contains: string };
          displayName?: { contains: string };
          accountNumber?: { contains: string };
        }>;
      } }) {
        const query = where.OR?.[0]?.normalizedSearch?.contains;

        return query
          ? clients.filter((client) => client.normalizedSearch.includes(query))
          : clients;
      },
      async findUnique({ where }: { where: { id: string } }) {
        return clients.find((client) => client.id === where.id) ?? null;
      }
    },
    contact: {
      async create({ data }: { data: {
        clientId: string;
        name: string;
        email?: string;
        phone?: string;
      } }) {
        const record = { id: `contact_${contacts.length + 1}`, ...data };
        contacts.push(record);
        return record;
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
    clients,
    contacts,
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

describe("staging client files", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.burgessPrismaClient = undefined;
  });

  it("parses and validates create form data", () => {
    const formData = new FormData();
    formData.set("accountNumber", " TEST-001 ");
    formData.set("displayName", " TEST Client ");
    formData.set("status", "ACTIVE");

    const parsed = validateClientFileFormInput(parseClientFileFormData(formData));

    expect(parsed).toMatchObject({
      ok: true,
      data: {
        accountNumber: "TEST-001",
        displayName: "TEST Client",
        status: "ACTIVE"
      }
    });
  });

  it("fails closed when staging writes are disabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createStagingClientFile({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        accountNumber: "TEST-001",
        displayName: "TEST Client",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "false"
      }
    });

    expect(result.ok).toBe(false);
    expect(fake.clients).toHaveLength(0);
  });

  it("fails closed when DATABASE_URL is missing", async () => {
    const fake = createFakePrisma();

    const result = await createStagingClientFile({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        accountNumber: "TEST-001",
        displayName: "TEST Client",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR"
      }
    });
    expect(databaseStatus()).toBe("missing_database_url");
  });

  it("validates required fields before creating a client file", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createStagingClientFile({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        accountNumber: "",
        displayName: "",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR"
      }
    });
    expect(fake.clients).toHaveLength(0);
  });

  it("creates client, contact, audit and timeline records when staging gate is enabled", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    const fake = createFakePrisma();

    const result = await createStagingClientFile({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        accountNumber: "TEST-001",
        displayName: "TEST Client File - Delete Later",
        status: "ACTIVE",
        contactName: "Test Contact",
        email: "test@example.test",
        phone: "+27 00 000 0000",
        openingNote: "Staging test note only"
      },
      environment: {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        id: "client_1",
        accountNumber: "TEST-001",
        displayName: "TEST Client File - Delete Later"
      }
    });
    expect(fake.clients).toHaveLength(1);
    expect(fake.contacts).toHaveLength(1);
    expect(fake.auditLogs).toHaveLength(1);
    expect(fake.timelineEvents).toHaveLength(1);
  });

  it("lists and searches client files", async () => {
    const fake = createFakePrisma();
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    await createStagingClientFile({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        accountNumber: "TEST-SEARCH",
        displayName: "Searchable Test Client",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true"
      }
    });

    const result = await listStagingClientFiles({
      prisma: fake.prisma,
      query: "searchable"
    });

    expect(result).toMatchObject({
      ok: true,
      data: [
        {
          accountNumber: "TEST-SEARCH",
          displayName: "Searchable Test Client"
        }
      ]
    });
  });

  it("returns client detail records and not-found results", async () => {
    const fake = createFakePrisma();
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    await createStagingClientFile({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        accountNumber: "TEST-DETAIL",
        displayName: "Detail Test Client",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true"
      }
    });

    await expect(getStagingClientFile({ prisma: fake.prisma, id: "client_1" })).resolves.toMatchObject({
      ok: true,
      data: {
        displayName: "Detail Test Client"
      }
    });
    await expect(getStagingClientFile({ prisma: fake.prisma, id: "missing" })).resolves.toMatchObject({
      ok: false,
      error: {
        code: "NOT_FOUND"
      }
    });
  });

  it("loads page list and detail through the guarded Prisma singleton", async () => {
    const fake = createFakePrisma();
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = fake.prisma as never;

    await createStagingClientFile({
      principal: stagingPrincipal,
      prisma: fake.prisma,
      input: {
        accountNumber: "TEST-PAGE",
        displayName: "Page Test Client",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true"
      }
    });

    await expect(loadStagingClientFileList({ query: "page" })).resolves.toMatchObject({
      databaseAvailable: true,
      clients: [
        {
          displayName: "Page Test Client"
        }
      ]
    });
    await expect(loadStagingClientFileDetail("client_1")).resolves.toMatchObject({
      displayName: "Page Test Client"
    });
  });

  it("reports unavailable page data when no database URL exists", async () => {
    await expect(loadStagingClientFileList({})).resolves.toEqual({
      databaseAvailable: false,
      clients: []
    });
    await expect(loadStagingClientFileDetail("client_1")).resolves.toBeNull();
  });

  it("reports unavailable page data when the list query throws", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      client: {
        async findMany() {
          throw new Error("query failed");
        }
      }
    } as never;

    await expect(loadStagingClientFileList({ query: "broken" })).resolves.toEqual({
      databaseAvailable: false,
      clients: []
    });
  });

  it("returns null when detail lookup throws", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");
    globalThis.burgessPrismaClient = {
      client: {
        async findUnique() {
          throw new Error("query failed");
        }
      }
    } as never;

    await expect(loadStagingClientFileDetail("client_1")).resolves.toBeNull();
  });

  it("reports page gate state separately from production writes", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    expect(
      getStagingClientFilePageState(stagingPrincipal, {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true",
        BURGESS_PRODUCTION_WRITES_ENABLED: "false"
      })
    ).toEqual({
      databaseAvailable: true,
      writesEnabled: true
    });
  });

  it("returns a transaction failure without creating a partial success", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/burgess_attorneys_dev");

    const result = await createStagingClientFile({
      principal: stagingPrincipal,
      prisma: {
        async $transaction() {
          throw new Error("database unavailable");
        }
      },
      input: {
        accountNumber: "TEST-FAIL",
        displayName: "Failing Test Client",
        status: "ACTIVE"
      },
      environment: {
        BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED: "true"
      }
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TRANSACTION_ERROR"
      }
    });
  });
});
