import { describe, expect, it } from "vitest";

import { createPrismaUsersRepository, mapPrismaUserToUserRecord } from "./users-prisma-repository";

const fakePrismaUser = {
  id: "user_owner_demo",
  email: "owner.demo@example.test",
  name: "Demo Principal Attorney",
  roles: [
    {
      role: {
        key: "OWNER_PRINCIPAL" as const
      }
    }
  ]
};

describe("Prisma users repository", () => {
  it("maps Prisma user rows to repository records", () => {
    expect(mapPrismaUserToUserRecord(fakePrismaUser)).toEqual({
      id: "user_owner_demo",
      email: "owner.demo@example.test",
      name: "Demo Principal Attorney",
      roles: ["OWNER_PRINCIPAL"]
    });
  });

  it("reads users by email through the Prisma boundary", async () => {
    const repository = createPrismaUsersRepository({
      user: {
        async findUnique() {
          return fakePrismaUser;
        },
        async findMany() {
          return [];
        }
      }
    });

    await expect(repository.findByEmail("owner.demo@example.test")).resolves.toEqual({
      id: "user_owner_demo",
      email: "owner.demo@example.test",
      name: "Demo Principal Attorney",
      roles: ["OWNER_PRINCIPAL"]
    });
  });

  it("returns null when a user is not found by id", async () => {
    const repository = createPrismaUsersRepository({
      user: {
        async findUnique() {
          return null;
        },
        async findMany() {
          return [];
        }
      }
    });

    await expect(repository.findById("missing_user")).resolves.toBeNull();
  });

  it("returns null when a user is not found by email", async () => {
    const repository = createPrismaUsersRepository({
      user: {
        async findUnique() {
          return null;
        },
        async findMany() {
          return [];
        }
      }
    });

    await expect(repository.findByEmail("missing@example.test")).resolves.toBeNull();
  });

  it("lists users by role through the Prisma boundary", async () => {
    const repository = createPrismaUsersRepository({
      user: {
        async findUnique() {
          return null;
        },
        async findMany(args) {
          expect(args.where.roles.some.role.key).toBe("OWNER_PRINCIPAL");
          expect(args.orderBy.email).toBe("asc");
          return [fakePrismaUser];
        }
      }
    });

    await expect(repository.listByRole("OWNER_PRINCIPAL")).resolves.toEqual([
      {
        id: "user_owner_demo",
        email: "owner.demo@example.test",
        name: "Demo Principal Attorney",
        roles: ["OWNER_PRINCIPAL"]
      }
    ]);
  });
});
