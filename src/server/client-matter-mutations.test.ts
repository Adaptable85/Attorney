import { describe, expect, it, vi } from "vitest";

import { evaluateClientMatterWriteGate, readReleaseGateConfig } from "@/config/release-gates";
import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { createLocalDevClientMatterServiceComposition } from "@/services/local-dev-service-composition";
import type { ServiceContext } from "@/services/service-context";
import { immediateTransactionBoundary } from "@/services/transaction-boundary";
import {
  createClientAction,
  createClientMutation,
  createMatterAction,
  createMatterMutation
} from "./client-matter-mutations";

const disabledGate = evaluateClientMatterWriteGate(
  readReleaseGateConfig({
    environment: "production",
    productionAuthReady: false,
    flags: {
      clientMatterWritesEnabled: true,
      productionAuthConfigured: true,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: false,
      devMutationEntrypointsEnabled: false,
      entraStagingAuthWiringEnabled: false,
      productionWritesEnabled: false
    }
  })
);

const enabledGate = evaluateClientMatterWriteGate(
  readReleaseGateConfig({
    environment: "production",
    productionAuthReady: true,
    flags: {
      clientMatterWritesEnabled: true,
      productionAuthConfigured: true,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: false,
      devMutationEntrypointsEnabled: false,
      entraStagingAuthWiringEnabled: false,
      productionWritesEnabled: true
    }
  })
);

const enabledDevGate = evaluateClientMatterWriteGate(
  readReleaseGateConfig({
    environment: "test",
    flags: {
      clientMatterWritesEnabled: true,
      productionAuthConfigured: false,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: true,
      devMutationEntrypointsEnabled: true,
      entraStagingAuthWiringEnabled: false,
      productionWritesEnabled: false
    }
  })
);

const principal = (role: AuthenticatedPrincipal["roles"][number]): AuthenticatedPrincipal => ({
  userId: role.toLowerCase(),
  email: `${role.toLowerCase()}@example.test`,
  roles: [role],
  provider: "future_provider_backed"
});

const ownerPrincipal = principal("OWNER_PRINCIPAL");
const supportPrincipal = principal("SUPPORT_ADMIN");
const agentPrincipal = principal("AGENT_SERVICE");
const reviewerPrincipal = principal("READ_ONLY_REVIEWER");

const serviceContext: ServiceContext = {
  actor: {
    userId: ownerPrincipal.userId,
    email: ownerPrincipal.email,
    primaryRole: "OWNER_PRINCIPAL",
    roles: ownerPrincipal.roles
  },
  source: "disabled-mutation-entrypoint-test",
  auditWriter: {
    record: async () => undefined
  }
};

const clientAudit = {
  eventType: "client_created" as const,
  targetType: "client",
  summary: "Disabled client create skeleton"
};

const matterAudit = {
  eventType: "matter_created" as const,
  targetType: "matter",
  summary: "Disabled matter create skeleton"
};

const clientInput = {
  accountNumber: "DEMO-CLIENT-3F",
  displayName: "Demo Phase 3F Client",
  status: "ACTIVE" as const
};

const matterInput = {
  clientId: "client-3f",
  accountNumber: "DEMO-MATTER-3F",
  name: "Demo Phase 3F Matter",
  description: "Disabled skeleton test matter",
  type: "CONTRACTS" as const,
  status: "OPEN" as const
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
  const now = new Date("2026-06-23T11:00:00.000Z");
  const clientRecord = {
    id: "client_demo_3g",
    accountNumber: clientInput.accountNumber,
    displayName: clientInput.displayName,
    normalizedSearch: "demo-client-3f demo phase 3f client",
    status: "ACTIVE" as const,
    createdAt: now,
    updatedAt: now
  };
  const matterRecord = {
    id: "matter_demo_3g",
    clientId: matterInput.clientId,
    accountNumber: matterInput.accountNumber,
    normalizedSearch: "demo-matter-3f demo phase 3f matter disabled skeleton test matter contracts open",
    name: matterInput.name,
    description: matterInput.description,
    type: "CONTRACTS" as const,
    status: "OPEN" as const,
    responsibleAttorneyId: null,
    supportUserId: null,
    nextStepDueDate: null,
    createdAt: now,
    updatedAt: now
  };
  const auditRecord = {
    id: "audit_demo_3g",
    eventType: "CLIENT_CREATED" as const,
    actorId: ownerPrincipal.userId,
    targetType: "client",
    targetId: null,
    summary: "Dev-only mutation audit",
    metadata: {},
    sensitive: true,
    createdAt: now
  };
  const transactionSpy = vi.fn();
  const fake: FakePrisma = {
    async $transaction<T>(work: (client: FakePrisma) => Promise<T>): Promise<T> {
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

function createComposition(prisma = createFakePrisma()) {
  const composition = createLocalDevClientMatterServiceComposition({
    prisma,
    environment: "test",
    source: "phase-3g-dev-mutation-test"
  });

  if (!composition.ok) {
    throw new Error("Expected local/dev composition");
  }

  return { prisma, composition: composition.data };
}

describe("disabled client/matter mutation entrypoint skeletons", () => {
  it("fails closed without a user", () => {
    expect(
      createClientAction({
        principal: null,
        releaseGate: enabledGate,
        serviceContext,
        audit: clientAudit,
        transactionBoundary: immediateTransactionBoundary,
        input: clientInput
      })
    ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
  });

  it("blocks agent and read-only reviewer create attempts", () => {
    for (const principalUnderTest of [agentPrincipal, reviewerPrincipal]) {
      expect(
        createMatterAction({
          principal: principalUnderTest,
          releaseGate: enabledGate,
          serviceContext,
          audit: matterAudit,
          transactionBoundary: immediateTransactionBoundary,
          input: matterInput
        })
      ).toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
    }
  });

  it("keeps owner and support admin disabled when live write gate is disabled", () => {
    for (const principalUnderTest of [ownerPrincipal, supportPrincipal]) {
      expect(
        createClientAction({
          principal: principalUnderTest,
          releaseGate: disabledGate,
          serviceContext,
          audit: clientAudit,
          transactionBoundary: immediateTransactionBoundary,
          input: clientInput
        })
      ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
    }
  });

  it("still returns disabled when the future gate dependencies pass", () => {
    expect(
      createMatterAction({
        principal: ownerPrincipal,
        releaseGate: enabledGate,
        serviceContext,
        audit: matterAudit,
        transactionBoundary: immediateTransactionBoundary,
        input: matterInput
      })
    ).toEqual({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR",
        message: "Live client/matter writes remain disabled until production auth and release approval are complete."
      }
    });
  });

  it("fails before mutation work when audit metadata or transaction dependency is missing", () => {
    expect(
      createClientAction({
        principal: ownerPrincipal,
        releaseGate: enabledGate,
        serviceContext,
        audit: null,
        transactionBoundary: immediateTransactionBoundary,
        input: clientInput
      })
    ).toMatchObject({ ok: false, error: { code: "AUDIT_ERROR" } });
    expect(
      createClientAction({
        principal: ownerPrincipal,
        releaseGate: enabledGate,
        serviceContext,
        audit: clientAudit,
        transactionBoundary: null,
        input: clientInput
      })
    ).toMatchObject({ ok: false, error: { code: "TRANSACTION_ERROR" } });
  });

  it("does not call repository work and returns safe typed errors", () => {
    const repositoryCreate = vi.fn();
    const result = createClientAction({
      principal: ownerPrincipal,
      releaseGate: disabledGate,
      serviceContext,
      audit: clientAudit,
      transactionBoundary: immediateTransactionBoundary,
      input: clientInput
    });

    expect(repositoryCreate).not.toHaveBeenCalled();
    expect(result).toMatchObject({ ok: false });
    expect(JSON.stringify(result)).not.toContain("stack");
  });
});

describe("dev-only client/matter mutation entrypoints", () => {
  it("blocks missing users, agents and read-only reviewers", async () => {
    const { composition } = createComposition();

    await expect(
      createClientMutation({
        principal: null,
        releaseGate: enabledDevGate,
        composition,
        input: clientInput
      })
    ).resolves.toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });

    for (const principalUnderTest of [agentPrincipal, reviewerPrincipal]) {
      await expect(
        createMatterMutation({
          principal: principalUnderTest,
          releaseGate: enabledDevGate,
          composition,
          input: matterInput
        })
      ).resolves.toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
    }
  });

  it("blocks owner and support admin when the dev gate is disabled without calling repositories", async () => {
    for (const principalUnderTest of [ownerPrincipal, supportPrincipal]) {
      const { prisma, composition } = createComposition();

      await expect(
        createClientMutation({
          principal: principalUnderTest,
          releaseGate: disabledGate,
          composition,
          input: clientInput
        })
      ).resolves.toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
      expect(prisma.client.create).not.toHaveBeenCalled();
      expect(prisma.auditLog.create).not.toHaveBeenCalled();
    }
  });

  it("allows owner and support admin only when explicit local/dev gate and composition are present", async () => {
    for (const principalUnderTest of [ownerPrincipal, supportPrincipal]) {
      const { prisma, composition } = createComposition();

      await expect(
        createClientMutation({
          principal: principalUnderTest,
          releaseGate: enabledDevGate,
          composition,
          input: clientInput
        })
      ).resolves.toMatchObject({ ok: true });
      expect(prisma.transactionSpy).toHaveBeenCalledOnce();
      expect(prisma.auditLog.create).toHaveBeenCalledOnce();
      expect(prisma.client.create).toHaveBeenCalledOnce();
    }
  });

  it("uses the audited matter service path when explicitly enabled", async () => {
    const { prisma, composition } = createComposition();

    await expect(
      createMatterMutation({
        principal: ownerPrincipal,
        releaseGate: enabledDevGate,
        composition,
        input: matterInput
      })
    ).resolves.toMatchObject({ ok: true });
    expect(prisma.transactionSpy).toHaveBeenCalledOnce();
    expect(prisma.auditLog.create).toHaveBeenCalledOnce();
    expect(prisma.matter.create).toHaveBeenCalledOnce();
  });

  it("returns safe typed errors for missing audit metadata, transaction dependency and service failures", async () => {
    const { prisma, composition } = createComposition();
    prisma.client.create.mockRejectedValueOnce(new Error("raw write failure"));

    await expect(
      createClientMutation({
        principal: ownerPrincipal,
        releaseGate: enabledDevGate,
        composition,
        audit: null,
        input: clientInput
      })
    ).resolves.toMatchObject({ ok: false, error: { code: "AUDIT_ERROR" } });
    await expect(
      createClientMutation({
        principal: ownerPrincipal,
        releaseGate: enabledDevGate,
        composition: {
          ...composition,
          clientDependencies: {
            ...composition.clientDependencies,
            transactionBoundary: undefined
          }
        },
        input: clientInput
      })
    ).resolves.toMatchObject({ ok: false, error: { code: "TRANSACTION_ERROR" } });

    const result = await createClientMutation({
      principal: ownerPrincipal,
      releaseGate: enabledDevGate,
      composition,
      input: clientInput
    });

    expect(result).toMatchObject({ ok: false, error: { code: "REPOSITORY_ERROR" } });
    expect(JSON.stringify(result)).not.toContain("raw write failure");
  });

  it("rejects real-looking client and matter fixtures in the dev-only path", async () => {
    const { composition } = createComposition();

    await expect(
      createClientMutation({
        principal: ownerPrincipal,
        releaseGate: enabledDevGate,
        composition,
        input: {
          ...clientInput,
          accountNumber: "REAL-CLIENT-001"
        }
      })
    ).resolves.toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
    await expect(
      createMatterMutation({
        principal: ownerPrincipal,
        releaseGate: enabledDevGate,
        composition,
        input: {
          ...matterInput,
          accountNumber: "REAL-MATTER-001"
        }
      })
    ).resolves.toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
  });
});
