import { describe, expect, it } from "vitest";

import { getPrismaClient } from "@/db/prisma";
import { createPrismaClientsRepository } from "./clients-prisma-repository";
import { requireSafeLocalDatabaseUrl } from "./db-test-guard";

const databaseUrl = requireSafeLocalDatabaseUrl();
const describeDb = databaseUrl ? describe : describe.skip;

describeDb("Prisma clients repository DB integration", () => {
  it("creates, reads and lists fake clients in the local dev database", async () => {
    const prisma = await getPrismaClient();
    const repository = createPrismaClientsRepository(
      prisma as unknown as Parameters<typeof createPrismaClientsRepository>[0]
    );
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const accountNumber = `DEMO-CLIENT-3B-${suffix}`;

    const created = await repository.create(
      {
        accountNumber,
        displayName: `Demo Phase 3B Client ${suffix}`
      },
      {
        actorId: "user_owner_demo",
        reason: "Phase 3B fake DB integration test"
      }
    );

    await expect(repository.findById(created.id)).resolves.toMatchObject({
      id: created.id,
      accountNumber,
      displayName: `Demo Phase 3B Client ${suffix}`,
      status: "ACTIVE"
    });
    await expect(repository.listOpen({ limit: 10 })).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: created.id })])
    );
    expect(Object.keys(repository).join(" ")).not.toMatch(/delete|hardDelete|remove/i);
  });
});
