import { describe, expect, it, vi } from "vitest";

import { fakeClientInput } from "@/test/fixtures";
import { createPrismaClientsRepository } from "./clients-prisma-repository";

const now = new Date("2026-06-18T00:00:00.000Z");

type ClientPrismaTestRecord = {
  id: string;
  accountNumber: string;
  displayName: string;
  normalizedSearch: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
};

function createPrismaClientFake(overrides: Partial<ClientPrismaTestRecord> = {}) {
  const record = createClientRecord(overrides);

  return {
    client: {
      create: vi.fn(async () => record),
      update: vi.fn(async () => record),
      findUnique: vi.fn(async (): Promise<ClientPrismaTestRecord | null> => record),
      findMany: vi.fn(async () => [record])
    }
  };
}

function createClientRecord(overrides: Partial<ClientPrismaTestRecord> = {}): ClientPrismaTestRecord {
  return {
    id: "client_demo_prisma",
    accountNumber: fakeClientInput.accountNumber,
    displayName: fakeClientInput.displayName,
    normalizedSearch: "demo-client-001 example orchard holdings",
    status: "ACTIVE" as const,
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

describe("Prisma clients repository", () => {
  it("creates clients through Prisma using validated domain fields", async () => {
    const prisma = createPrismaClientFake();
    const repository = createPrismaClientsRepository(prisma);

    await expect(
      repository.create(fakeClientInput, {
        actorId: "owner",
        reason: "unit test"
      })
    ).resolves.toMatchObject({
      id: "client_demo_prisma",
      accountNumber: fakeClientInput.accountNumber,
      displayName: fakeClientInput.displayName,
      status: "ACTIVE"
    });

    expect(prisma.client.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        accountNumber: fakeClientInput.accountNumber,
        displayName: fakeClientInput.displayName,
        normalizedSearch: "demo-client-001 example orchard holdings"
      })
    });
  });

  it("reads and lists clients without exposing delete behavior", async () => {
    const repository = createPrismaClientsRepository(createPrismaClientFake());

    await expect(repository.findById("client_demo_prisma")).resolves.toMatchObject({
      id: "client_demo_prisma"
    });
    await expect(repository.listOpen({ limit: 5 })).resolves.toHaveLength(1);
    expect(Object.keys(repository).join(" ")).not.toMatch(/delete|hardDelete|remove/i);
  });

  it("updates draftable fields and archives through status changes", async () => {
    const prisma = createPrismaClientFake();
    const repository = createPrismaClientsRepository(prisma);

    await expect(
      repository.updateDraftableFields(
        "client_demo_prisma",
        {
          accountNumber: " DEMO-CLIENT-UPDATED ",
          displayName: " Updated Demo Client ",
          status: "INACTIVE"
        },
        { actorId: "owner" }
      )
    ).resolves.toMatchObject({ id: "client_demo_prisma" });
    expect(prisma.client.update).toHaveBeenCalledWith({
      where: { id: "client_demo_prisma" },
      data: {
        accountNumber: "DEMO-CLIENT-UPDATED",
        displayName: "Updated Demo Client",
        normalizedSearch: "demo-client-updated updated demo client",
        status: "INACTIVE"
      }
    });

    await repository.archive("client_demo_prisma", { actorId: "owner" });
    expect(prisma.client.update).toHaveBeenLastCalledWith({
      where: { id: "client_demo_prisma" },
      data: { status: "ARCHIVED" }
    });
  });

  it("does not invent client update fields when no partial fields are supplied", async () => {
    const prisma = createPrismaClientFake();
    const repository = createPrismaClientsRepository(prisma);

    await repository.updateDraftableFields("client_demo_prisma", {}, { actorId: "owner" });

    expect(prisma.client.update).toHaveBeenCalledWith({
      where: { id: "client_demo_prisma" },
      data: {}
    });
  });

  it("returns null for missing clients and applies default and cursor pagination", async () => {
    const prisma = createPrismaClientFake();
    prisma.client.findUnique.mockResolvedValueOnce(null);
    const repository = createPrismaClientsRepository(prisma);

    await expect(repository.findById("missing")).resolves.toBeNull();

    await repository.listOpen();
    expect(prisma.client.findMany).toHaveBeenCalledWith({
      where: { status: { not: "ARCHIVED" } },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: 25
    });

    await repository.listOpen({ limit: 5, cursor: "client_cursor" });
    expect(prisma.client.findMany).toHaveBeenLastCalledWith({
      where: { status: { not: "ARCHIVED" } },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: 5,
      cursor: { id: "client_cursor" },
      skip: 1
    });
  });
});
