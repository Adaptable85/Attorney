import { describe, expect, it } from "vitest";

import type { CreateClientInput } from "@/domain/clients";
import { validateClientCreationInput } from "@/domain/clients";
import type { ClientsRepository } from "@/repositories/clients-repository";
import { fakeClient } from "@/test/fixtures";
import * as clientsServiceExports from "./clients-service";
import { createClientRecord, getClientSummary, listClientSummaries } from "./clients-service";

const now = new Date("2026-06-18T00:00:00.000Z");

const ownerPrincipal = {
  userId: "owner",
  email: "owner@example.test",
  roles: ["OWNER_PRINCIPAL" as const],
  provider: "local_dev_placeholder" as const
};

const supportPrincipal = {
  userId: "support",
  email: "support@example.test",
  roles: ["SUPPORT_ADMIN" as const],
  provider: "local_dev_placeholder" as const
};

const reviewerPrincipal = {
  userId: "reviewer",
  email: "reviewer@example.test",
  roles: ["READ_ONLY_REVIEWER" as const],
  provider: "local_dev_placeholder" as const
};

const agentPrincipal = {
  userId: "agent",
  email: "agent@example.test",
  roles: ["AGENT_SERVICE" as const],
  provider: "local_dev_placeholder" as const
};

function createFakeClientsRepository(): ClientsRepository {
  const records = [
    {
      ...fakeClient,
      createdAt: now,
      updatedAt: now
    }
  ];

  return {
    async create(input: CreateClientInput) {
      const validated = validateClientCreationInput(input);

      return {
        id: "client_demo_created",
        ...validated,
        createdAt: now,
        updatedAt: now
      };
    },
    async updateDraftableFields() {
      throw new Error("Not used in service tests");
    },
    async archive() {
      throw new Error("Not used in service tests");
    },
    async findById(id) {
      return records.find((record) => record.id === id) ?? null;
    },
    async listOpen() {
      return records;
    }
  };
}

describe("clients service", () => {
  it("allows owner, support admin and read-only reviewer users to list client summaries", async () => {
    const repository = createFakeClientsRepository();

    await expect(listClientSummaries(ownerPrincipal, { clientsRepository: repository })).resolves
      .toMatchObject({ ok: true });
    await expect(listClientSummaries(supportPrincipal, { clientsRepository: repository })).resolves
      .toMatchObject({ ok: true });
    await expect(listClientSummaries(reviewerPrincipal, { clientsRepository: repository })).resolves
      .toMatchObject({ ok: true });
  });

  it("blocks agent service users from normal admin client listing", async () => {
    await expect(
      listClientSummaries(agentPrincipal, { clientsRepository: createFakeClientsRepository() })
    ).resolves.toEqual({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "This user cannot access admin client records."
      }
    });
  });

  it("allows owner and support admin users to create clients through the service boundary", async () => {
    const input = {
      accountNumber: "DEMO-CLIENT-NEW",
      displayName: "Demo Client New"
    };

    await expect(
      createClientRecord(ownerPrincipal, input, { clientsRepository: createFakeClientsRepository() })
    ).resolves.toMatchObject({ ok: true });
    await expect(
      createClientRecord(supportPrincipal, input, {
        clientsRepository: createFakeClientsRepository()
      })
    ).resolves.toMatchObject({ ok: true });
  });

  it("blocks agent and read-only reviewer users from creating clients", async () => {
    const input = {
      accountNumber: "DEMO-CLIENT-NEW",
      displayName: "Demo Client New"
    };

    await expect(
      createClientRecord(agentPrincipal, input, { clientsRepository: createFakeClientsRepository() })
    ).resolves.toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
    await expect(
      createClientRecord(reviewerPrincipal, input, {
        clientsRepository: createFakeClientsRepository()
      })
    ).resolves.toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
  });

  it("returns validation errors without raw stack traces", async () => {
    const result = await createClientRecord(
      ownerPrincipal,
      {
        accountNumber: "",
        displayName: ""
      },
      { clientsRepository: createFakeClientsRepository() }
    );

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Client input failed validation."
      }
    });
    expect(JSON.stringify(result)).not.toContain("ZodError");
    expect(JSON.stringify(result)).not.toContain("stack");
  });

  it("returns not found for missing client summaries", async () => {
    await expect(
      getClientSummary(ownerPrincipal, "missing", { clientsRepository: createFakeClientsRepository() })
    ).resolves.toEqual({
      ok: false,
      error: {
        code: "NOT_FOUND",
        message: "Client record was not found."
      }
    });
  });

  it("converts repository failures into safe client service errors", async () => {
    const failingRepository = {
      ...createFakeClientsRepository(),
      async create() {
        throw new Error("database secret details");
      },
      async findById() {
        throw new Error("database secret details");
      },
      async listOpen() {
        throw new Error("database secret details");
      }
    };

    await expect(
      listClientSummaries(ownerPrincipal, { clientsRepository: failingRepository })
    ).resolves.toEqual({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR",
        message: "The requested records could not be loaded safely."
      }
    });
    await expect(
      getClientSummary(ownerPrincipal, fakeClient.id, { clientsRepository: failingRepository })
    ).resolves.toMatchObject({ ok: false, error: { code: "REPOSITORY_ERROR" } });
    await expect(
      createClientRecord(
        ownerPrincipal,
        {
          accountNumber: "DEMO-CLIENT-NEW",
          displayName: "Demo Client New"
        },
        { clientsRepository: failingRepository }
      )
    ).resolves.toMatchObject({ ok: false, error: { code: "REPOSITORY_ERROR" } });
  });

  it("does not export hard-delete client operations", () => {
    expect(Object.keys(clientsServiceExports).join(" ")).not.toMatch(/delete|hardDelete|remove/i);
  });
});
