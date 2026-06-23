import { describe, expect, it } from "vitest";

import { getPrismaClient } from "@/db/prisma";
import { createPrismaAuditRepository } from "./audit-prisma-repository";
import { requireSafeLocalDatabaseUrl } from "./db-test-guard";

const databaseUrl = requireSafeLocalDatabaseUrl();
const describeDb = databaseUrl ? describe : describe.skip;

describeDb("Prisma audit repository DB integration", () => {
  it("writes and reads a fake audit log in the local dev database", async () => {
    const prisma = await getPrismaClient();
    const repository = createPrismaAuditRepository(
      prisma as unknown as Parameters<typeof createPrismaAuditRepository>[0]
    );
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const targetId = `client_demo_audit_${suffix}`;

    const created = await repository.record({
      eventType: "client_created",
      targetType: "client",
      targetId,
      summary: "Phase 3D fake audit repository test",
      metadata: {
        accountNumber: `DEMO-CLIENT-AUDIT-${suffix}`
      }
    });

    expect(created).toMatchObject({
      eventType: "client_created",
      targetType: "client",
      targetId,
      sensitive: true
    });
    await expect(repository.findByTarget("client", targetId)).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: created.id })])
    );
  });
});
