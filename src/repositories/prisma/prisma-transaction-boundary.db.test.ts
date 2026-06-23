import { describe, expect, it } from "vitest";

import { getPrismaClient } from "@/db/prisma";
import { createPrismaTransactionBoundary } from "./prisma-transaction-boundary";
import { requireSafeLocalDatabaseUrl } from "./db-test-guard";

const databaseUrl = requireSafeLocalDatabaseUrl();
const describeDb = databaseUrl ? describe : describe.skip;

type TransactionClient = {
  client: {
    create(args: {
      data: {
        accountNumber: string;
        displayName: string;
        normalizedSearch: string;
      };
    }): Promise<{ id: string; accountNumber: string }>;
    findUnique(args: { where: { accountNumber: string } }): Promise<{ id: string } | null>;
  };
  auditLog: {
    create(args: {
      data: {
        eventType: "CLIENT_CREATED";
        targetType: string;
        targetId: string;
        summary: string;
        sensitive: boolean;
        metadata: Record<string, unknown>;
      };
    }): Promise<{ id: string; targetId: string | null }>;
  };
};

type PrismaWithTransaction = {
  $transaction<T>(work: (client: TransactionClient) => Promise<T>): Promise<T>;
  client: TransactionClient["client"];
};

describeDb("Prisma transaction boundary DB integration", () => {
  it("creates a fake client and audit log atomically in the local dev database", async () => {
    const prisma = (await getPrismaClient()) as unknown as PrismaWithTransaction;
    const boundary = createPrismaTransactionBoundary<TransactionClient>(prisma);
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const accountNumber = `DEMO-CLIENT-3C-TX-${suffix}`;

    const result = await boundary.execute(async (tx) => {
      const client = await tx.client.create({
        data: {
          accountNumber,
          displayName: `Demo Phase 3C Transaction Client ${suffix}`,
          normalizedSearch: accountNumber.toLowerCase()
        }
      });
      const audit = await tx.auditLog.create({
        data: {
          eventType: "CLIENT_CREATED",
          targetType: "client",
          targetId: client.id,
          summary: "Phase 3C fake transaction audit",
          sensitive: true,
          metadata: {
            accountNumber,
            phase: "3C"
          }
        }
      });

      return { client, audit };
    });

    expect(result.client.accountNumber).toBe(accountNumber);
    expect(result.audit.targetId).toBe(result.client.id);
  });

  it("rolls back fake client creation when transaction work fails", async () => {
    const prisma = (await getPrismaClient()) as unknown as PrismaWithTransaction;
    const boundary = createPrismaTransactionBoundary<TransactionClient>(prisma);
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const accountNumber = `DEMO-CLIENT-3C-ROLLBACK-${suffix}`;

    await expect(
      boundary.execute(async (tx) => {
        await tx.client.create({
          data: {
            accountNumber,
            displayName: `Demo Phase 3C Rollback Client ${suffix}`,
            normalizedSearch: accountNumber.toLowerCase()
          }
        });

        throw new Error("force rollback for Phase 3C DB test");
      })
    ).rejects.toThrow("force rollback");

    await expect(prisma.client.findUnique({ where: { accountNumber } })).resolves.toBeNull();
  });
});
