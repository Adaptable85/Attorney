import { describe, expect, it, vi } from "vitest";

import {
  createAuditWriterFromRepository,
  createPrismaAuditRepository
} from "./audit-prisma-repository";

const createdAt = new Date("2026-06-23T10:00:00.000Z");

function createPrismaAuditFake() {
  const record = {
    id: "audit_demo_prisma",
    eventType: "CLIENT_CREATED" as const,
    actorId: "owner",
    targetType: "client",
    targetId: "client_demo",
    summary: "Created fake client",
    metadata: {
      accountNumber: "DEMO-CLIENT-AUDIT"
    },
    sensitive: true,
    createdAt
  };

  return {
    auditLog: {
      create: vi.fn(async () => record),
      findMany: vi.fn(async () => [record])
    }
  };
}

describe("Prisma audit repository", () => {
  it("writes audit events using Prisma enum and stored metadata", async () => {
    const prisma = createPrismaAuditFake();
    const repository = createPrismaAuditRepository(prisma);

    await expect(
      repository.record({
        eventType: "client_created",
        actorId: "owner",
        targetType: "client",
        targetId: "client_demo",
        summary: "Created fake client",
        metadata: {
          accountNumber: "DEMO-CLIENT-AUDIT"
        }
      })
    ).resolves.toMatchObject({
      id: "audit_demo_prisma",
      eventType: "client_created",
      actorId: "owner",
      targetType: "client",
      targetId: "client_demo",
      sensitive: true
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        eventType: "CLIENT_CREATED",
        actorId: "owner",
        targetType: "client",
        targetId: "client_demo",
        sensitive: true
      })
    });
  });

  it("finds audit logs by target and exposes an audit writer", async () => {
    const repository = createPrismaAuditRepository(createPrismaAuditFake());
    const writer = createAuditWriterFromRepository(repository);

    await expect(repository.findByTarget("client", "client_demo")).resolves.toHaveLength(1);
    await expect(
      writer.record({
        eventType: "client_created",
        actorId: "owner",
        targetType: "client",
        targetId: "client_demo",
        summary: "Created fake client",
        sensitive: true,
        occurredAt: createdAt
      })
    ).resolves.toBeUndefined();
  });
});
