type PrismaClientLike = {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
};

type PrismaClientConstructor = new () => PrismaClientLike;

declare global {
  var burgessPrismaClient: PrismaClientLike | undefined;
}

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export async function getPrismaClient(): Promise<PrismaClientLike> {
  if (globalThis.burgessPrismaClient) {
    return globalThis.burgessPrismaClient;
  }

  const prismaModule = await import("@prisma/client");
  const PrismaClient = (prismaModule as unknown as { PrismaClient?: PrismaClientConstructor })
    .PrismaClient;

  if (!PrismaClient) {
    throw new Error("Prisma client has not been generated yet.");
  }

  globalThis.burgessPrismaClient = new PrismaClient();
  return globalThis.burgessPrismaClient;
}

export function resetPrismaClientForTests(): void {
  globalThis.burgessPrismaClient = undefined;
}
