import { describe, expect, it } from "vitest";

import { getPrismaClient } from "@/db/prisma";
import { fakeUsers } from "@/test/fixtures";

import { requireSafeLocalDatabaseUrl } from "./db-test-guard";
import { createPrismaUsersRepository } from "./users-prisma-repository";

const databaseUrl = requireSafeLocalDatabaseUrl();
const describeDb = databaseUrl ? describe : describe.skip;
const owner = fakeUsers.owner;

type PrismaUsersDbClient = Parameters<typeof createPrismaUsersRepository>[0] & {
  role: {
    upsert(args: {
      where: { key: "OWNER_PRINCIPAL" };
      update: Record<string, never>;
      create: { key: "OWNER_PRINCIPAL"; name: string; description: string };
    }): Promise<{ id: string }>;
  };
  user: {
    upsert(args: {
      where: { email: string };
      update: { name: string; status: "ACTIVE" };
      create: { id: string; email: string; name: string; status: "ACTIVE" };
    }): Promise<unknown>;
  };
  userRole: {
    upsert(args: {
      where: { userId_roleId: { userId: string; roleId: string } };
      update: Record<string, never>;
      create: { userId: string; roleId: string };
    }): Promise<unknown>;
  };
};

describeDb("Prisma users repository integration", () => {
  it("creates and reads fake users and roles in the local dev database", async () => {
    const prisma = (await getPrismaClient()) as unknown as PrismaUsersDbClient;

    const role = await prisma.role.upsert({
      where: { key: "OWNER_PRINCIPAL" },
      update: {},
      create: {
        key: "OWNER_PRINCIPAL",
        name: "Owner / Principal Attorney",
        description: "Local fake owner role for repository testing."
      }
    });

    await prisma.user.upsert({
      where: { email: owner.email },
      update: {
        name: owner.name,
        status: "ACTIVE"
      },
      create: {
        id: owner.id,
        email: owner.email,
        name: owner.name,
        status: "ACTIVE"
      }
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: owner.id,
          roleId: role.id
        }
      },
      update: {},
      create: {
        userId: owner.id,
        roleId: role.id
      }
    });

    const repository = createPrismaUsersRepository(prisma);

    await expect(repository.findByEmail(owner.email)).resolves.toMatchObject({
      id: owner.id,
      email: owner.email,
      name: owner.name,
      roles: ["OWNER_PRINCIPAL"]
    });
  });
});
