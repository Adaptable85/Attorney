import { describe, expect, it, vi } from "vitest";

import { createClientRecord } from "./clients-service";
import { createLocalDevClientMatterServiceComposition } from "./local-dev-service-composition";

const ownerPrincipal = {
  userId: "owner",
  email: "owner@example.test",
  roles: ["OWNER_PRINCIPAL" as const],
  provider: "local_dev_placeholder" as const
};

type FakePrisma = {
  $transaction<T>(work: (client: FakePrisma) => Promise<T>): Promise<T>;
  transactionSpy: ReturnType<typeof vi.fn>;
  client: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
  matter: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
  auditLog: {
    create: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};

function createFakePrisma() {
  const now = new Date("2026-06-23T10:00:00.000Z");
  const clientRecord = {
    id: "client_demo_composed",
    accountNumber: "DEMO-CLIENT-COMPOSED",
    displayName: "Demo Composed Client",
    normalizedSearch: "demo-client-composed demo composed client",
    status: "ACTIVE" as const,
    createdAt: now,
    updatedAt: now
  };
  const matterRecord = {
    id: "matter_demo_composed",
    clientId: "client_demo_composed",
    accountNumber: "DEMO-MATTER-COMPOSED",
    normalizedSearch: "demo-matter-composed demo composed matter fake composed matter contracts open",
    name: "Demo Composed Matter",
    description: "Fake composed matter",
    type: "CONTRACTS" as const,
    status: "OPEN" as const,
    responsibleAttorneyId: null,
    supportUserId: null,
    nextStepDueDate: null,
    createdAt: now,
    updatedAt: now
  };
  const auditRecord = {
    id: "audit_demo_composed",
    eventType: "CLIENT_CREATED" as const,
    actorId: "owner",
    targetType: "client",
    targetId: null,
    summary: "Composed audit",
    metadata: {},
    sensitive: true,
    createdAt: now
  };
  const transactionSpy = vi.fn();
  const fake: FakePrisma = {
    async $transaction<T>(work: (client: typeof fake) => Promise<T>): Promise<T> {
      transactionSpy();
      return work(fake);
    },
    transactionSpy,
    client: {
      create: vi.fn(async () => clientRecord),
      update: vi.fn(async () => clientRecord),
      findUnique: vi.fn(async () => clientRecord),
      findMany: vi.fn(async () => [clientRecord])
    },
    matter: {
      create: vi.fn(async () => matterRecord),
      update: vi.fn(async () => matterRecord),
      findUnique: vi.fn(async () => matterRecord),
      findMany: vi.fn(async () => [matterRecord])
    },
    auditLog: {
      create: vi.fn(async () => auditRecord),
      findMany: vi.fn(async () => [auditRecord])
    }
  };

  return fake;
}

describe("local/dev service composition", () => {
  it("labels itself local/dev only and exposes no UI handlers", () => {
    const result = createLocalDevClientMatterServiceComposition({
      prisma: createFakePrisma(),
      environment: "test"
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        kind: "local-dev-client-matter-service-composition",
        exposesUiHandlers: false
      }
    });
    if (result.ok) {
      expect(result.data.exposesUiHandlers).toBe(false);
      expect(result.data).not.toHaveProperty("serverAction");
      expect(result.data).not.toHaveProperty("routeHandler");
    }
  });

  it("fails clearly without Prisma or in production", () => {
    expect(
      createLocalDevClientMatterServiceComposition({ environment: "test" })
    ).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR",
        message: "A Prisma client is required for local/dev service composition."
      }
    });
    expect(
      createLocalDevClientMatterServiceComposition({
        prisma: createFakePrisma(),
        environment: "production"
      })
    ).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR",
        message: "Local/dev service composition is disabled in production."
      }
    });
  });

  it("creates service context with actor role and source", () => {
    const result = createLocalDevClientMatterServiceComposition({
      prisma: createFakePrisma(),
      environment: "test",
      source: "composition-test"
    });

    if (!result.ok) {
      throw new Error("Expected composition");
    }

    expect(result.data.createServiceContext(ownerPrincipal)).toMatchObject({
      ok: true,
      data: {
        source: "composition-test",
        actor: {
          userId: "owner",
          primaryRole: "OWNER_PRINCIPAL"
        }
      }
    });
  });

  it("wires client creates through transaction-scoped repositories and audit writer", async () => {
    const prisma = createFakePrisma();
    const result = createLocalDevClientMatterServiceComposition({
      prisma,
      environment: "test"
    });

    if (!result.ok) {
      throw new Error("Expected composition");
    }
    const context = result.data.createServiceContext(ownerPrincipal);

    if (!context.ok) {
      throw new Error("Expected context");
    }

    await expect(
      createClientRecord(
        context.data,
        {
          accountNumber: "DEMO-CLIENT-COMPOSED",
          displayName: "Demo Composed Client"
        },
        result.data.clientDependencies
      )
    ).resolves.toMatchObject({ ok: true });
    expect(prisma.transactionSpy).toHaveBeenCalledOnce();
    expect(prisma.auditLog.create).toHaveBeenCalledOnce();
    expect(prisma.client.create).toHaveBeenCalledOnce();
  });

  it("wraps raw repository errors from composed dependencies safely", async () => {
    const prisma = createFakePrisma();
    prisma.client.create.mockRejectedValueOnce(new Error("raw database details"));
    const result = createLocalDevClientMatterServiceComposition({
      prisma,
      environment: "test"
    });

    if (!result.ok) {
      throw new Error("Expected composition");
    }
    const context = result.data.createServiceContext(ownerPrincipal);

    if (!context.ok) {
      throw new Error("Expected context");
    }

    const response = await createClientRecord(
      context.data,
      {
        accountNumber: "DEMO-CLIENT-COMPOSED",
        displayName: "Demo Composed Client"
      },
      result.data.clientDependencies
    );

    expect(response).toMatchObject({ ok: false, error: { code: "REPOSITORY_ERROR" } });
    expect(JSON.stringify(response)).not.toContain("raw database details");
  });
});
