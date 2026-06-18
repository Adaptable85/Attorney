import type { RoleKey } from "@/domain/roles";
import type { UserRecord, UsersRepository } from "@/repositories/users-repository";

type PrismaUserWithRoles = {
  id: string;
  email: string;
  name: string;
  roles: readonly {
    role: {
      key: RoleKey;
    };
  }[];
};

type PrismaUsersClient = {
  user: {
    findUnique(args: {
      where: { id: string } | { email: string };
      include: { roles: { include: { role: true } } };
    }): Promise<PrismaUserWithRoles | null>;
    findMany(args: {
      where: { roles: { some: { role: { key: RoleKey } } } };
      include: { roles: { include: { role: true } } };
      orderBy: { email: "asc" };
    }): Promise<PrismaUserWithRoles[]>;
  };
};

export function mapPrismaUserToUserRecord(user: PrismaUserWithRoles): UserRecord {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles.map((userRole) => userRole.role.key)
  };
}

export function createPrismaUsersRepository(prisma: PrismaUsersClient): UsersRepository {
  const includeRoles = { roles: { include: { role: true } } } as const;

  return {
    async findById(id) {
      const user = await prisma.user.findUnique({
        where: { id },
        include: includeRoles
      });

      return user ? mapPrismaUserToUserRecord(user) : null;
    },

    async findByEmail(email) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: includeRoles
      });

      return user ? mapPrismaUserToUserRecord(user) : null;
    },

    async listByRole(role) {
      const users = await prisma.user.findMany({
        where: {
          roles: {
            some: {
              role: {
                key: role
              }
            }
          }
        },
        include: includeRoles,
        orderBy: { email: "asc" }
      });

      return users.map(mapPrismaUserToUserRecord);
    }
  };
}
