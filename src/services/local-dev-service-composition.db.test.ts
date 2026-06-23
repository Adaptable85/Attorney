import { describe, expect, it } from "vitest";

import { getPrismaClient } from "@/db/prisma";
import { createPrismaClientsRepository } from "@/repositories/prisma/clients-prisma-repository";
import { requireSafeLocalDatabaseUrl } from "@/repositories/prisma/db-test-guard";
import { createClientRecord } from "./clients-service";
import { createLocalDevClientMatterServiceComposition } from "./local-dev-service-composition";
import { createMatterRecord } from "./matters-service";

const databaseUrl = requireSafeLocalDatabaseUrl();
const describeDb = databaseUrl ? describe : describe.skip;

const ownerPrincipal = {
  userId: "user_phase_3d_owner",
  email: "phase-3d-owner@example.test",
  roles: ["OWNER_PRINCIPAL" as const],
  provider: "local_dev_placeholder" as const
};

const supportPrincipal = {
  userId: "user_phase_3d_support",
  email: "phase-3d-support@example.test",
  roles: ["SUPPORT_ADMIN" as const],
  provider: "local_dev_placeholder" as const
};

const agentPrincipal = {
  userId: "user_phase_3d_agent",
  email: "phase-3d-agent@example.test",
  roles: ["AGENT_SERVICE" as const],
  provider: "local_dev_placeholder" as const
};

const reviewerPrincipal = {
  userId: "user_phase_3d_reviewer",
  email: "phase-3d-reviewer@example.test",
  roles: ["READ_ONLY_REVIEWER" as const],
  provider: "local_dev_placeholder" as const
};

type CompositionDbClient = Parameters<typeof createLocalDevClientMatterServiceComposition>[0]["prisma"] & {
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
};

async function ensureFakeUser(
  prisma: CompositionDbClient,
  principal:
    | typeof ownerPrincipal
    | typeof supportPrincipal
    | typeof agentPrincipal
    | typeof reviewerPrincipal
) {
  await prisma.user.upsert({
    where: { id: principal.userId },
    update: {
      email: principal.email,
      name: principal.userId,
      status: "ACTIVE"
    },
    create: {
      id: principal.userId,
      email: principal.email,
      name: principal.userId,
      status: "ACTIVE"
    }
  });
}

async function createComposition() {
  const prisma = (await getPrismaClient()) as unknown as CompositionDbClient;

  await ensureFakeUser(prisma, ownerPrincipal);
  await ensureFakeUser(prisma, supportPrincipal);

  const composition = createLocalDevClientMatterServiceComposition({
    prisma,
    source: "phase-3d-db-test",
    environment: "test"
  });

  if (!composition.ok) {
    throw new Error("Expected local/dev composition");
  }

  return { prisma, composition: composition.data };
}

async function auditLogsFor(
  prisma: CompositionDbClient,
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

describeDb("local/dev client matter service composition DB integration", () => {
  it("lets owner and support users create fake clients with audit logs", async () => {
    const { prisma, composition } = await createComposition();
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    for (const [principal, accountNumber] of [
      [ownerPrincipal, `DEMO-CLIENT-3D-OWNER-${suffix}`],
      [supportPrincipal, `DEMO-CLIENT-3D-SUPPORT-${suffix}`]
    ] as const) {
      const context = composition.createServiceContext(principal);

      if (!context.ok) {
        throw new Error("Expected service context");
      }

      await expect(
        createClientRecord(
          context.data,
          {
            accountNumber,
            displayName: `Demo Phase 3D Client ${accountNumber}`
          },
          composition.clientDependencies
        )
      ).resolves.toMatchObject({ ok: true });
      await expect(prisma.client.findUnique({ where: { accountNumber } })).resolves.toEqual(
        expect.objectContaining({ id: expect.any(String) })
      );
      await expect(
        auditLogsFor(
          prisma,
          principal.userId,
          "client",
          "Client create requested through audited service boundary"
        )
      ).resolves.toEqual(
        expect.arrayContaining([expect.objectContaining({ actorId: principal.userId })])
      );
    }
  });

  it("blocks agent client creates and reviewer matter creates without writing records", async () => {
    const { prisma, composition } = await createComposition();
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const agentAccountNumber = `DEMO-CLIENT-3D-AGENT-BLOCKED-${suffix}`;
    const reviewerMatterAccount = `DEMO-MATTER-3D-REVIEWER-BLOCKED-${suffix}`;
    const agentContext = composition.createServiceContext(agentPrincipal);
    const reviewerContext = composition.createServiceContext(reviewerPrincipal);

    if (!agentContext.ok || !reviewerContext.ok) {
      throw new Error("Expected blocked service contexts");
    }

    await expect(
      createClientRecord(
        agentContext.data,
        {
          accountNumber: agentAccountNumber,
          displayName: "Demo Agent Blocked Client"
        },
        composition.clientDependencies
      )
    ).resolves.toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
    await expect(prisma.client.findUnique({ where: { accountNumber: agentAccountNumber } })).resolves
      .toBeNull();

    await expect(
      createMatterRecord(
        reviewerContext.data,
        {
          clientId: "client_demo_missing",
          accountNumber: reviewerMatterAccount,
          name: "Demo Reviewer Blocked Matter",
          description: "Fake reviewer blocked matter",
          type: "CONTRACTS"
        },
        composition.matterDependencies
      )
    ).resolves.toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
    await expect(prisma.matter.findMany({ where: { accountNumber: reviewerMatterAccount } })).resolves
      .toHaveLength(0);
  });

  it("lets owner create a fake matter for a fake client with an audit log", async () => {
    const { prisma, composition } = await createComposition();
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const context = composition.createServiceContext(ownerPrincipal);

    if (!context.ok) {
      throw new Error("Expected service context");
    }

    const client = await createClientRecord(
      context.data,
      {
        accountNumber: `DEMO-CLIENT-3D-MATTER-${suffix}`,
        displayName: `Demo Phase 3D Matter Client ${suffix}`
      },
      composition.clientDependencies
    );

    if (!client.ok) {
      throw new Error("Expected fake client");
    }

    const matterAccountNumber = `DEMO-MATTER-3D-OWNER-${suffix}`;
    await expect(
      createMatterRecord(
        context.data,
        {
          clientId: client.data.id,
          accountNumber: matterAccountNumber,
          name: `Demo Phase 3D Matter ${suffix}`,
          description: "Fake matter through local/dev composition",
          type: "CONTRACTS"
        },
        composition.matterDependencies
      )
    ).resolves.toMatchObject({ ok: true });
    await expect(prisma.matter.findMany({ where: { accountNumber: matterAccountNumber } })).resolves
      .toHaveLength(1);
    await expect(
      auditLogsFor(
        prisma,
        ownerPrincipal.userId,
        "matter",
        "Matter create requested through audited service boundary"
      )
    ).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ actorId: ownerPrincipal.userId })])
    );
  });

  it("rolls back fake client creation when composed repository work fails", async () => {
    const { prisma, composition } = await createComposition();
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const accountNumber = `DEMO-CLIENT-3D-ROLLBACK-${suffix}`;
    const context = composition.createServiceContext(ownerPrincipal);

    if (!context.ok) {
      throw new Error("Expected service context");
    }

    await expect(
      createClientRecord(
        context.data,
        {
          accountNumber,
          displayName: `Demo Phase 3D Rollback Client ${suffix}`
        },
        {
          ...composition.clientDependencies,
          createClientsRepositoryForTransaction(scope) {
            const repository = createPrismaClientsRepository(
              scope as Parameters<typeof createPrismaClientsRepository>[0]
            );

            return {
              ...repository,
              async create(input, actor) {
                await repository.create(input, actor);
                throw new Error("force rollback from composed client repository");
              }
            };
          }
        }
      )
    ).resolves.toMatchObject({ ok: false, error: { code: "REPOSITORY_ERROR" } });
    await expect(prisma.client.findUnique({ where: { accountNumber } })).resolves.toBeNull();
  });
});
