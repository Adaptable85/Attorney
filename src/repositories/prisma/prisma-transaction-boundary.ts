import type { TransactionBoundary } from "@/services/transaction-boundary";

type PrismaTransactionClient<TClient> = {
  $transaction<T>(work: (client: TClient) => Promise<T>): Promise<T>;
};

export function createPrismaTransactionBoundary<TClient>(
  prisma: PrismaTransactionClient<TClient>
): TransactionBoundary<TClient> {
  return {
    async execute(work) {
      return prisma.$transaction((client) => work(client));
    }
  };
}
