type PrismaClientLike = {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
};

type PrismaClientConstructor = new (options: { adapter: unknown }) => PrismaClientLike;
type PrismaPgConstructor = new (config: { connectionString: string }) => unknown;

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

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required before constructing Prisma Client.");
  }

  const adapterModule = await import("@prisma/adapter-pg");
  const PrismaPg = (adapterModule as unknown as { PrismaPg?: PrismaPgConstructor }).PrismaPg;

  if (!PrismaPg) {
    throw new Error("Prisma Postgres adapter is not available.");
  }

  const prismaModule = await import("@prisma/client");
  const PrismaClient = (prismaModule as unknown as { PrismaClient?: PrismaClientConstructor })
    .PrismaClient;

  if (!PrismaClient) {
    throw new Error("Prisma client has not been generated yet.");
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });

  globalThis.burgessPrismaClient = new PrismaClient({ adapter });
  return globalThis.burgessPrismaClient;
}

export function resetPrismaClientForTests(): void {
  globalThis.burgessPrismaClient = undefined;
}
