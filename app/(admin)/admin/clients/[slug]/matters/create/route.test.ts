import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  access: {
    allowed: false,
    principal: null as null | {
      userId: string;
      email: string;
      roles: ["READ_ONLY_REVIEWER"];
      provider: "staging_admin_password";
    }
  },
  hasDatabaseUrl: true,
  createResult: {
    ok: false as boolean,
    error: {
      message: "Staging matter writes are not enabled for this session."
    },
    data: undefined as undefined | {
      id: string;
      clientId: string;
      accountNumber: string;
      name: string;
    }
  },
  createStagingMatter: vi.fn()
}));

vi.mock("@/auth/admin-route-access", () => ({
  async requireAdminRouteAccess() {
    return mocks.access;
  }
}));

vi.mock("@/db/prisma", () => ({
  hasDatabaseUrl() {
    return mocks.hasDatabaseUrl;
  },
  async getPrismaClient() {
    return {};
  }
}));

vi.mock("@/server/staging-matters", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/staging-matters")>();

  return {
    ...actual,
    async createStagingMatter(input: unknown) {
      mocks.createStagingMatter(input);
      return mocks.createResult;
    }
  };
});

import { POST } from "./route";

function createRequest() {
  const formData = new FormData();
  formData.set("clientId", "client_1");
  formData.set("accountNumber", "TEST-MATTER-001");
  formData.set("name", "TEST Matter - Delete Later");
  formData.set("description", "Staging matter route test");
  formData.set("type", "OTHER");
  formData.set("status", "OPEN");

  return new Request("https://example.test/admin/clients/client_1/matters/create", {
    method: "POST",
    body: formData
  });
}

describe("staging matter create route", () => {
  it("fails closed when admin is not signed in", async () => {
    mocks.access = { allowed: false, principal: null };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ slug: "client_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/admin/clients/client_1/matters/new?");
    expect(mocks.createStagingMatter).not.toHaveBeenCalled();
  });

  it("fails closed when DATABASE_URL is unavailable", async () => {
    mocks.access = {
      allowed: true,
      principal: {
        userId: "staging_admin_password_reviewer",
        email: "staging.admin.review@example.test",
        roles: ["READ_ONLY_REVIEWER"],
        provider: "staging_admin_password"
      }
    };
    mocks.hasDatabaseUrl = false;

    const response = await POST(createRequest(), {
      params: Promise.resolve({ slug: "client_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("DATABASE_URL");
    expect(mocks.createStagingMatter).not.toHaveBeenCalled();
    mocks.hasDatabaseUrl = true;
  });

  it("redirects with error when service rejects creation", async () => {
    mocks.access = {
      allowed: true,
      principal: {
        userId: "staging_admin_password_reviewer",
        email: "staging.admin.review@example.test",
        roles: ["READ_ONLY_REVIEWER"],
        provider: "staging_admin_password"
      }
    };
    mocks.createResult = {
      ok: false,
      error: {
        message: "Staging matter writes are not enabled for this session."
      },
      data: undefined
    };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ slug: "client_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("Staging%20matter%20writes");
    expect(mocks.createStagingMatter).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          clientId: "client_1",
          name: "TEST Matter - Delete Later"
        })
      })
    );
  });

  it("redirects to the client matters panel after successful creation", async () => {
    mocks.access = {
      allowed: true,
      principal: {
        userId: "staging_admin_password_reviewer",
        email: "staging.admin.review@example.test",
        roles: ["READ_ONLY_REVIEWER"],
        provider: "staging_admin_password"
      }
    };
    mocks.createResult = {
      ok: true,
      error: {
        message: ""
      },
      data: {
        id: "matter_1",
        clientId: "client_1",
        accountNumber: "TEST-MATTER-001",
        name: "TEST Matter - Delete Later"
      }
    };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ slug: "client_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin/clients/client_1?matterCreated=1#matters");
  });
});
