import { ROLE_KEYS } from "../src/domain/roles";
import { getPrismaClient } from "../src/db/prisma";
import { fakeClient, fakeMatter, fakeUsers } from "../src/test/fixtures";

type SeedPrismaClient = {
  role: {
    upsert(args: {
      where: { key: string };
      update: Record<string, never>;
      create: { key: string; name: string; description: string };
    }): Promise<{ id: string; key: string }>;
  };
  user: {
    upsert(args: {
      where: { email: string };
      update: { name: string; status: "ACTIVE" };
      create: { id: string; email: string; name: string; status: "ACTIVE" };
    }): Promise<{ id: string }>;
  };
  userRole: {
    upsert(args: {
      where: { userId_roleId: { userId: string; roleId: string } };
      update: Record<string, never>;
      create: { userId: string; roleId: string };
    }): Promise<unknown>;
  };
  $disconnect(): Promise<void>;
};

const roleLabels = {
  OWNER_PRINCIPAL: "Owner / Principal Attorney",
  SUPPORT_ADMIN: "Support Admin",
  AGENT_SERVICE: "Agent Service",
  READ_ONLY_REVIEWER: "Read Only Reviewer"
} as const;

async function main(): Promise<void> {
  const isDevSeedEnabled = process.env.BURGESS_ALLOW_DEV_SEED === "true";

  if (!isDevSeedEnabled) {
    console.log("Dev seed skipped. Set BURGESS_ALLOW_DEV_SEED=true for local development only.");
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Dev seed must never run in production.");
  }

  if (!process.env.DATABASE_URL) {
    console.log("Dev seed skipped. DATABASE_URL is not configured.");
    return;
  }

  const prisma = (await getPrismaClient()) as unknown as SeedPrismaClient;

  try {
    const roles = new Map<string, { id: string; key: string }>();

    for (const roleKey of ROLE_KEYS) {
      const role = await prisma.role.upsert({
        where: { key: roleKey },
        update: {},
        create: {
          key: roleKey,
          name: roleLabels[roleKey],
          description: `Local fake ${roleLabels[roleKey]} role.`
        }
      });
      roles.set(role.key, role);
    }

    for (const user of Object.values(fakeUsers)) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          status: "ACTIVE"
        },
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
          status: "ACTIVE"
        }
      });

      for (const roleKey of user.roles) {
        const role = roles.get(roleKey);

        if (!role) {
          throw new Error(`Missing seeded role ${roleKey}.`);
        }

        await prisma.userRole.upsert({
          where: {
            userId_roleId: {
              userId: user.id,
              roleId: role.id
            }
          },
          update: {},
          create: {
            userId: user.id,
            roleId: role.id
          }
        });
      }
    }

    console.log("Dev seed completed with fake users and roles only.");
    console.log("Fake users:", Object.keys(fakeUsers).join(", "));
    console.log("Fake client fixture not written:", fakeClient.accountNumber);
    console.log("Fake matter fixture not written:", fakeMatter.accountNumber);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
