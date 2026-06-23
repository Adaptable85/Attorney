import { describe, expect, it } from "vitest";

import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import { evaluateClientMatterWriteGate, readReleaseGateConfig } from "@/config/release-gates";
import { getPrismaClient } from "@/db/prisma";
import { createPrismaClientsRepository } from "@/repositories/prisma/clients-prisma-repository";
import { createPrismaMattersRepository } from "@/repositories/prisma/matters-prisma-repository";
import { createLocalDevClientMatterServiceComposition } from "@/services/local-dev-service-composition";
import { requireSafeLocalDatabaseUrl } from "@/repositories/prisma/db-test-guard";
import { createClientMutation, createMatterMutation } from "./client-matter-mutations";

const databaseUrl = requireSafeLocalDatabaseUrl();
const describeDb = databaseUrl ? describe : describe.skip;

const enabledDevGate = evaluateClientMatterWriteGate(
  readReleaseGateConfig({
    environment: "test",
    flags: {
      clientMatterWritesEnabled: true,
      productionAuthConfigured: false,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: true,
      devMutationEntrypointsEnabled: true,
      productionWritesEnabled: false
    }
  })
);

const disabledGate = evaluateClientMatterWriteGate(
  readReleaseGateConfig({
    environment: "test",
    flags: {
      clientMatterWritesEnabled: false,
      productionAuthConfigured: false,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: true,
      devMutationEntrypointsEnabled: true,
      productionWritesEnabled: false
    }
  })
);

const principal = (role: AuthenticatedPrincipal["roles"][number]): AuthenticatedPrincipal => ({
  userId: `user_phase_3g_${role.toLowerCase()}`,
  email: `phase-3g-${role.toLowerCase()}@example.test`,
  roles: [role],
  provider: "local_dev_placeholder"
});

const ownerPrincipal = principal("OWNER_PRINCIPAL");
const supportPrincipal = principal("SUPPORT_ADMIN");
const agentPrincipal = principal("AGENT_SERVICE");
const reviewerPrincipal = principal("READ_ONLY_REVIEWER");

type MutationDbClient = Parameters<typeof createLocalDevClientMatterServiceComposition>[0]["prisma"] & {
  user: {
    upsert(args: {
      where: { id: string };
      update: { email: string; name: string; status: "ACTIVE" };
      create: { id: string; email: string; name: string; status: "ACTIVE" };
    }): Promise<unknown>;
  };
  client: {
    findUnique(args: { where: { accountNumber: string } }): Promise<{ id: string } | null>;
  };
  matter: {
    findMany(args: { where: { accountNumber: string } }): Promise<{ id: string }[]>;
  };
  auditLog: {
    findMany(args: {
      where: {
        actorId?: string;
        targetType?: string;
        summary?: string;
      };
      orderBy: { createdAt: "desc" };
      take: number;
    }): Promise<{ id: string; actorId: string | null; targetType: string | null; summary: string }[]>;
  };
} & Parameters<typeof createPrismaClientsRepository>[0] &
  Parameters<typeof createPrismaMattersRepository>[0];

async function ensureFakeUser(prisma: MutationDbClient, user: AuthenticatedPrincipal) {
  await prisma.user.upsert({
    where: { id: user.userId },
    update: {
      email: user.email,
      name: user.userId,
      status: "ACTIVE"
    },
    create: {
      id: user.userId,
      email: user.email,
      name: user.userId,
      status: "ACTIVE"
    }
  });
}

async function createComposition() {
  const prisma = (await getPrismaClient()) as unknown as MutationDbClient;

  for (const user of [ownerPrincipal, supportPrincipal, agentPrincipal, reviewerPrincipal]) {
    await ensureFakeUser(prisma, user);
  }

  const composition = createLocalDevClientMatterServiceComposition({
    prisma,
    source: "phase-3g-db-test",
    environment: "test"
  });

  if (!composition.ok) {
    throw new Error("Expected local/dev composition");
  }

  return { prisma, composition: composition.data };
}

async function auditLogsFor(
  prisma: MutationDbClient,
  actorId: string,
  targetType: string,
  summary: string
) {
  return prisma.auditLog.findMany({
    where: {
      actorId,
      targetType,
      summary
    },
    orderBy: { createdAt: "desc" },
    take: 10
  });
}

describeDb("dev-only client/matter mutation DB integration", () => {
  it("lets owner create a fake client through the dev mutation path with an audit log", async () => {
    const { prisma, composition } = await createComposition();
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const accountNumber = `DEMO-CLIENT-3G-OWNER-${suffix}`;

    const result = await createClientMutation({
      principal: ownerPrincipal,
      releaseGate: enabledDevGate,
      composition,
      input: {
        accountNumber,
        displayName: `Demo Phase 3G Owner Client ${suffix}`
      }
    });

    expect(result).toMatchObject({ ok: true });
    await expect(prisma.client.findUnique({ where: { accountNumber } })).resolves.toEqual(
      expect.objectContaining({ id: expect.any(String) })
    );
    await expect(
      auditLogsFor(
        prisma,
        ownerPrincipal.userId,
        "client",
        "Client create requested through audited service boundary"
      )
    ).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ actorId: ownerPrincipal.userId })])
    );

    if (result.ok) {
      await createPrismaClientsRepository(prisma).archive(result.data.id, {
        actorId: ownerPrincipal.userId,
        reason: "Phase 3G DB test cleanup"
      });
    }
  });

  it("lets support admin create a fake matter through the dev mutation path with an audit log", async () => {
    const { prisma, composition } = await createComposition();
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const client = await createClientMutation({
      principal: ownerPrincipal,
      releaseGate: enabledDevGate,
      composition,
      input: {
        accountNumber: `DEMO-CLIENT-3G-MATTER-${suffix}`,
        displayName: `Demo Phase 3G Matter Client ${suffix}`
      }
    });

    if (!client.ok) {
      throw new Error("Expected fake client");
    }

    const matterAccountNumber = `DEMO-MATTER-3G-SUPPORT-${suffix}`;
    const matter = await createMatterMutation({
      principal: supportPrincipal,
      releaseGate: enabledDevGate,
      composition,
      input: {
        clientId: client.data.id,
        accountNumber: matterAccountNumber,
        name: `Demo Phase 3G Support Matter ${suffix}`,
        description: "Fake support matter through dev-only mutation path",
        type: "CONTRACTS"
      }
    });

    expect(matter).toMatchObject({ ok: true });
    await expect(prisma.matter.findMany({ where: { accountNumber: matterAccountNumber } })).resolves
      .toHaveLength(1);
    await expect(
      auditLogsFor(
        prisma,
        supportPrincipal.userId,
        "matter",
        "Matter create requested through audited service boundary"
      )
    ).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ actorId: supportPrincipal.userId })])
    );

    if (matter.ok) {
      await createPrismaMattersRepository(prisma).archive(matter.data.id, {
        actorId: supportPrincipal.userId,
        reason: "Phase 3G DB test cleanup"
      });
    }
    await createPrismaClientsRepository(prisma).archive(client.data.id, {
      actorId: ownerPrincipal.userId,
      reason: "Phase 3G DB test cleanup"
    });
  });

  it("blocks agent, reviewer and disabled-gate writes without creating fake rows", async () => {
    const { prisma, composition } = await createComposition();
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const agentAccountNumber = `DEMO-CLIENT-3G-AGENT-BLOCKED-${suffix}`;
    const reviewerAccountNumber = `DEMO-CLIENT-3G-REVIEWER-BLOCKED-${suffix}`;
    const disabledAccountNumber = `DEMO-CLIENT-3G-DISABLED-${suffix}`;

    for (const [user, accountNumber, gate] of [
      [agentPrincipal, agentAccountNumber, enabledDevGate],
      [reviewerPrincipal, reviewerAccountNumber, enabledDevGate],
      [ownerPrincipal, disabledAccountNumber, disabledGate]
    ] as const) {
      await expect(
        createClientMutation({
          principal: user,
          releaseGate: gate,
          composition,
          input: {
            accountNumber,
            displayName: `Demo Blocked Client ${accountNumber}`
          }
        })
      ).resolves.toMatchObject({ ok: false });
      await expect(prisma.client.findUnique({ where: { accountNumber } })).resolves.toBeNull();
    }
  });
});
