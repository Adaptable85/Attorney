import { describe, expect, it } from "vitest";

import type { CreateMatterInput } from "@/domain/matters";
import { validateMatterCreationInput } from "@/domain/matters";
import type { MattersRepository } from "@/repositories/matters-repository";
import { fakeMatter } from "@/test/fixtures";
import * as mattersServiceExports from "./matters-service";
import {
  createMatterRecord,
  getMatterSummary,
  listMatterSummaries
} from "./matters-service";

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

function createFakeMattersRepository(): MattersRepository {
  const records = [
    {
      ...fakeMatter,
      createdAt: now,
      updatedAt: now
    }
  ];

  return {
    async create(input: CreateMatterInput) {
      const validated = validateMatterCreationInput(input);

      return {
        id: "matter_demo_created",
        ...validated,
        createdAt: now,
        updatedAt: now
      };
    },
    async updateOperationalFields() {
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

describe("matters service", () => {
  it("allows owner, support admin and read-only reviewer users to list matter summaries", async () => {
    const repository = createFakeMattersRepository();

    await expect(listMatterSummaries(ownerPrincipal, { mattersRepository: repository })).resolves
      .toMatchObject({ ok: true });
    await expect(listMatterSummaries(supportPrincipal, { mattersRepository: repository })).resolves
      .toMatchObject({ ok: true });
    await expect(listMatterSummaries(reviewerPrincipal, { mattersRepository: repository })).resolves
      .toMatchObject({ ok: true });
  });

  it("blocks agent service users from normal admin matter listing", async () => {
    await expect(
      listMatterSummaries(agentPrincipal, { mattersRepository: createFakeMattersRepository() })
    ).resolves.toEqual({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "This user cannot access admin matter records."
      }
    });
  });

  it("returns matter summaries without workflow action fields", async () => {
    const result = await listMatterSummaries(ownerPrincipal, {
      mattersRepository: createFakeMattersRepository()
    });

    expect(result).toMatchObject({ ok: true });
    expect(JSON.stringify(result)).not.toMatch(/approve|send|delete/i);
  });

  it("allows owner and support admin users to create matters through the service boundary", async () => {
    const input = {
      clientId: "client_demo_001",
      accountNumber: "DEMO-MATTER-NEW",
      name: "Demo Matter New",
      description: "Fake matter for service validation",
      type: "CONTRACTS" as const
    };

    await expect(
      createMatterRecord(ownerPrincipal, input, { mattersRepository: createFakeMattersRepository() })
    ).resolves.toMatchObject({ ok: true });
    await expect(
      createMatterRecord(supportPrincipal, input, {
        mattersRepository: createFakeMattersRepository()
      })
    ).resolves.toMatchObject({ ok: true });
  });

  it("blocks agent and read-only reviewer users from creating matters", async () => {
    const input = {
      clientId: "client_demo_001",
      accountNumber: "DEMO-MATTER-NEW",
      name: "Demo Matter New",
      description: "Fake matter for service validation",
      type: "CONTRACTS" as const
    };

    await expect(
      createMatterRecord(agentPrincipal, input, { mattersRepository: createFakeMattersRepository() })
    ).resolves.toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
    await expect(
      createMatterRecord(reviewerPrincipal, input, {
        mattersRepository: createFakeMattersRepository()
      })
    ).resolves.toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
  });

  it("returns validation errors without raw stack traces", async () => {
    const result = await createMatterRecord(
      ownerPrincipal,
      {
        clientId: "",
        accountNumber: "",
        name: "",
        description: "",
        type: "CONTRACTS"
      },
      { mattersRepository: createFakeMattersRepository() }
    );

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Matter input failed validation."
      }
    });
    expect(JSON.stringify(result)).not.toContain("ZodError");
    expect(JSON.stringify(result)).not.toContain("stack");
  });

  it("returns not found for missing matter summaries", async () => {
    await expect(
      getMatterSummary(ownerPrincipal, "missing", { mattersRepository: createFakeMattersRepository() })
    ).resolves.toEqual({
      ok: false,
      error: {
        code: "NOT_FOUND",
        message: "Matter record was not found."
      }
    });
  });

  it("converts repository failures into safe matter service errors", async () => {
    const failingRepository = {
      ...createFakeMattersRepository(),
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
      listMatterSummaries(ownerPrincipal, { mattersRepository: failingRepository })
    ).resolves.toEqual({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR",
        message: "The requested records could not be loaded safely."
      }
    });
    await expect(
      getMatterSummary(ownerPrincipal, fakeMatter.id, { mattersRepository: failingRepository })
    ).resolves.toMatchObject({ ok: false, error: { code: "REPOSITORY_ERROR" } });
    await expect(
      createMatterRecord(
        ownerPrincipal,
        {
          clientId: "client_demo_001",
          accountNumber: "DEMO-MATTER-NEW",
          name: "Demo Matter New",
          description: "Fake matter for service validation",
          type: "CONTRACTS"
        },
        { mattersRepository: failingRepository }
      )
    ).resolves.toMatchObject({ ok: false, error: { code: "REPOSITORY_ERROR" } });
  });

  it("does not export hard-delete matter operations", () => {
    expect(Object.keys(mattersServiceExports).join(" ")).not.toMatch(/delete|hardDelete|remove/i);
  });
});
