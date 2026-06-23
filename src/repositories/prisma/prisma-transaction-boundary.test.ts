import { describe, expect, it, vi } from "vitest";

import { createPrismaTransactionBoundary } from "./prisma-transaction-boundary";

describe("Prisma transaction boundary", () => {
  it("runs work inside Prisma $transaction", async () => {
    const transactionClient = { name: "tx" };
    const transaction = vi.fn();
    const prisma = {
      async $transaction<T>(work: (client: typeof transactionClient) => Promise<T>): Promise<T> {
        transaction();
        return work(transactionClient);
      }
    };
    const boundary = createPrismaTransactionBoundary(prisma);

    await expect(boundary.execute(async (client) => client.name)).resolves.toBe("tx");
    expect(transaction).toHaveBeenCalledOnce();
  });
});
