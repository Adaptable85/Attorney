import { describe, expect, it, vi } from "vitest";

import { fakeMatterInput } from "@/test/fixtures";
import { createPrismaMattersRepository } from "./matters-prisma-repository";

const now = new Date("2026-06-18T00:00:00.000Z");

type MatterPrismaTestRecord = {
  id: string;
  clientId: string;
  accountNumber: string;
  normalizedSearch: string;
  name: string;
  description: string;
  type:
    | "FAMILY_LAW"
    | "MAINTENANCE"
    | "DIVORCE"
    | "CARE_AND_CUSTODY"
    | "COMMERCIAL_LAW"
    | "FINANCIAL_DISTRESS"
    | "CONTRACTS"
    | "BUSINESS_RESCUE"
    | "CIVIL_LITIGATION"
    | "OTHER";
  status:
    | "OPEN"
    | "PENDING"
    | "WAITING_ON_CLIENT"
    | "WAITING_ON_COURT"
    | "WAITING_ON_PAYMENT"
    | "CLOSED"
    | "ARCHIVED";
  responsibleAttorneyId: string | null;
  supportUserId: string | null;
  nextStepDueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function createPrismaMatterFake(overrides: Partial<MatterPrismaTestRecord> = {}) {
  const record = createMatterRecord(overrides);

  return {
    matter: {
      create: vi.fn(async () => record),
      update: vi.fn(async () => record),
      findUnique: vi.fn(async (): Promise<MatterPrismaTestRecord | null> => record),
      findMany: vi.fn(async () => [record])
    }
  };
}

function createMatterRecord(overrides: Partial<MatterPrismaTestRecord> = {}): MatterPrismaTestRecord {
  return {
    id: "matter_demo_prisma",
    clientId: fakeMatterInput.clientId,
    accountNumber: fakeMatterInput.accountNumber,
    normalizedSearch: "demo-matter-001 example orchard contract review fake contract review matter for deterministic tests contracts open",
    name: fakeMatterInput.name,
    description: fakeMatterInput.description,
    type: "CONTRACTS" as const,
    status: "OPEN" as const,
    responsibleAttorneyId: null,
    supportUserId: null,
    nextStepDueDate: null,
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

describe("Prisma matters repository", () => {
  it("creates matters through Prisma using validated domain fields", async () => {
    const prisma = createPrismaMatterFake();
    const repository = createPrismaMattersRepository(prisma);

    await expect(
      repository.create(fakeMatterInput, {
        actorId: "owner",
        reason: "unit test"
      })
    ).resolves.toMatchObject({
      id: "matter_demo_prisma",
      clientId: fakeMatterInput.clientId,
      accountNumber: fakeMatterInput.accountNumber,
      name: fakeMatterInput.name,
      status: "OPEN"
    });

    expect(prisma.matter.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        clientId: fakeMatterInput.clientId,
        accountNumber: fakeMatterInput.accountNumber,
        name: fakeMatterInput.name,
        status: "OPEN"
      })
    });
  });

  it("reads and lists matters without exposing delete behavior", async () => {
    const repository = createPrismaMattersRepository(createPrismaMatterFake());

    await expect(repository.findById("matter_demo_prisma")).resolves.toMatchObject({
      id: "matter_demo_prisma"
    });
    await expect(repository.listOpen({ limit: 5 })).resolves.toHaveLength(1);
    expect(Object.keys(repository).join(" ")).not.toMatch(/delete|hardDelete|remove/i);
  });

  it("maps nullable optional fields and sends optional create fields when present", async () => {
    const nextStepDueDate = new Date("2026-08-01T00:00:00.000Z");
    const prisma = createPrismaMatterFake({
      responsibleAttorneyId: "user_owner_demo",
      supportUserId: "user_support_demo",
      nextStepDueDate
    });
    const repository = createPrismaMattersRepository(prisma);

    await expect(
      repository.create(
        {
          ...fakeMatterInput,
          responsibleAttorneyId: "user_owner_demo",
          supportUserId: "user_support_demo",
          nextStepDueDate
        },
        { actorId: "owner" }
      )
    ).resolves.toMatchObject({
      responsibleAttorneyId: "user_owner_demo",
      supportUserId: "user_support_demo",
      nextStepDueDate
    });
    expect(prisma.matter.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        responsibleAttorneyId: "user_owner_demo",
        supportUserId: "user_support_demo",
        nextStepDueDate
      })
    });
  });

  it("updates operational fields and archives through status changes", async () => {
    const nextStepDueDate = new Date("2026-08-01T00:00:00.000Z");
    const prisma = createPrismaMatterFake();
    const repository = createPrismaMattersRepository(prisma);

    await expect(
      repository.updateOperationalFields(
        "matter_demo_prisma",
        {
          accountNumber: " DEMO-MATTER-UPDATED ",
          name: " Updated Demo Matter ",
          description: " Updated fake matter description ",
          status: "WAITING_ON_CLIENT",
          type: "COMMERCIAL_LAW",
          responsibleAttorneyId: "user_owner_demo",
          supportUserId: "user_support_demo",
          nextStepDueDate
        },
        { actorId: "owner" }
      )
    ).resolves.toMatchObject({ id: "matter_demo_prisma" });
    expect(prisma.matter.update).toHaveBeenCalledWith({
      where: { id: "matter_demo_prisma" },
      data: {
        accountNumber: "DEMO-MATTER-UPDATED",
        name: "Updated Demo Matter",
        description: "Updated fake matter description",
        type: "COMMERCIAL_LAW",
        status: "WAITING_ON_CLIENT",
        responsibleAttorneyId: "user_owner_demo",
        supportUserId: "user_support_demo",
        nextStepDueDate,
        normalizedSearch:
          "demo-matter-updated updated demo matter updated fake matter description commercial_law waiting_on_client"
      }
    });

    await repository.archive("matter_demo_prisma", { actorId: "owner" });
    expect(prisma.matter.update).toHaveBeenLastCalledWith({
      where: { id: "matter_demo_prisma" },
      data: { status: "ARCHIVED" }
    });
  });

  it("does not invent matter update fields when no partial fields are supplied", async () => {
    const prisma = createPrismaMatterFake();
    const repository = createPrismaMattersRepository(prisma);

    await repository.updateOperationalFields("matter_demo_prisma", {}, { actorId: "owner" });

    expect(prisma.matter.update).toHaveBeenCalledWith({
      where: { id: "matter_demo_prisma" },
      data: {}
    });
  });

  it("returns null for missing matters and applies default and cursor pagination", async () => {
    const prisma = createPrismaMatterFake();
    prisma.matter.findUnique.mockResolvedValueOnce(null);
    const repository = createPrismaMattersRepository(prisma);

    await expect(repository.findById("missing")).resolves.toBeNull();

    await repository.listOpen();
    expect(prisma.matter.findMany).toHaveBeenCalledWith({
      where: { status: { not: "ARCHIVED" } },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: 25
    });

    await repository.listOpen({ limit: 5, cursor: "matter_cursor" });
    expect(prisma.matter.findMany).toHaveBeenLastCalledWith({
      where: { status: { not: "ARCHIVED" } },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: 5,
      cursor: { id: "matter_cursor" },
      skip: 1
    });
  });
});
