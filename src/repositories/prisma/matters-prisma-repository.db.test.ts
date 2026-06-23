import { describe, expect, it } from "vitest";

import { getPrismaClient } from "@/db/prisma";
import { createPrismaClientsRepository } from "./clients-prisma-repository";
import { requireSafeLocalDatabaseUrl } from "./db-test-guard";
import { createPrismaMattersRepository } from "./matters-prisma-repository";

const databaseUrl = requireSafeLocalDatabaseUrl();
const describeDb = databaseUrl ? describe : describe.skip;

describeDb("Prisma matters repository DB integration", () => {
  it("creates, reads, lists and updates fake matters in the local dev database", async () => {
    const prisma = await getPrismaClient();
    const clientsRepository = createPrismaClientsRepository(
      prisma as unknown as Parameters<typeof createPrismaClientsRepository>[0]
    );
    const mattersRepository = createPrismaMattersRepository(
      prisma as unknown as Parameters<typeof createPrismaMattersRepository>[0]
    );
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const client = await clientsRepository.create(
      {
        accountNumber: `DEMO-CLIENT-3B-MATTER-${suffix}`,
        displayName: `Demo Phase 3B Matter Client ${suffix}`
      },
      {
        actorId: "user_owner_demo",
        reason: "Phase 3B fake DB integration test"
      }
    );

    const created = await mattersRepository.create(
      {
        clientId: client.id,
        accountNumber: `DEMO-MATTER-3B-${suffix}`,
        name: `Demo Phase 3B Matter ${suffix}`,
        description: "Fake matter for local repository adapter DB test",
        type: "CONTRACTS"
      },
      {
        actorId: "user_owner_demo",
        reason: "Phase 3B fake DB integration test"
      }
    );

    await expect(mattersRepository.findById(created.id)).resolves.toMatchObject({
      id: created.id,
      clientId: client.id,
      status: "OPEN"
    });
    await expect(mattersRepository.listOpen({ limit: 10 })).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: created.id })])
    );

    const nextStepDueDate = new Date("2026-08-01T00:00:00.000Z");
    await expect(
      mattersRepository.updateOperationalFields(
        created.id,
        {
          status: "WAITING_ON_CLIENT",
          nextStepDueDate
        },
        {
          actorId: "user_owner_demo",
          reason: "Phase 3B fake DB integration update test"
        }
      )
    ).resolves.toMatchObject({
      id: created.id,
      status: "WAITING_ON_CLIENT",
      nextStepDueDate
    });
    expect(Object.keys(mattersRepository).join(" ")).not.toMatch(/delete|hardDelete|remove/i);
  });
});
