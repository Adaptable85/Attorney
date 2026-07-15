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
      message: "Staging client file writes are not enabled for this session."
    },
    data: undefined as
      | undefined
      | {
          id: string;
          accountNumber: string;
          displayName: string;
        }
  },
  createStagingClientFile: vi.fn()
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

vi.mock("@/server/staging-client-files", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/staging-client-files")>();

  return {
    ...actual,
    async createStagingClientFile(input: unknown) {
      mocks.createStagingClientFile(input);
      return mocks.createResult;
    }
  };
});

import { POST } from "./route";

function createRequest() {
  const formData = new FormData();
  formData.set("accountNumber", "TEST-001");
  formData.set("displayName", "TEST Client");
  formData.set("status", "ACTIVE");

  return new Request("https://example.test/admin/clients/create", {
    method: "POST",
    body: formData
  });
}

describe("staging client create route", () => {
  it("fails closed when admin is not signed in", async () => {
    mocks.access = { allowed: false, principal: null };

    const response = await POST(createRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/admin/clients/new?error=");
    expect(mocks.createStagingClientFile).not.toHaveBeenCalled();
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

    const response = await POST(createRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("DATABASE_URL");
    expect(mocks.createStagingClientFile).not.toHaveBeenCalled();
    mocks.hasDatabaseUrl = true;
  });

  it("redirects back to new form when creation is rejected", async () => {
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
        message: "Staging client file writes are not enabled for this session."
      },
      data: undefined
    };

    const response = await POST(createRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("Staging%20client%20file%20writes");
    expect(mocks.createStagingClientFile).toHaveBeenCalled();
  });

  it("redirects to client list after successful creation", async () => {
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
        id: "client_1",
        accountNumber: "TEST-001",
        displayName: "TEST Client"
      }
    };

    const response = await POST(createRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin/clients?created=1");
  });
});
