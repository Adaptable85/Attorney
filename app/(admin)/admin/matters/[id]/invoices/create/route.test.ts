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
      message: "Add at least one draft billing line before creating a draft invoice."
    },
    data: undefined as undefined | { id: string; internalDraftReference: string }
  },
  createMatterDraftInvoice: vi.fn()
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

vi.mock("@/server/staging-matter-invoices", () => ({
  async createMatterDraftInvoice(input: unknown) {
    mocks.createMatterDraftInvoice(input);
    return mocks.createResult;
  }
}));

import { POST } from "./route";

function principal() {
  return {
    userId: "staging_admin_password_reviewer",
    email: "staging.admin.review@example.test",
    roles: ["READ_ONLY_REVIEWER"] as ["READ_ONLY_REVIEWER"],
    provider: "staging_admin_password" as const
  };
}

function createRequest() {
  return new Request("https://example.test/admin/matters/matter_1/invoices/create", {
    method: "POST"
  });
}

describe("staging matter draft invoice route", () => {
  it("fails closed when admin is not signed in", async () => {
    mocks.access = { allowed: false, principal: null };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "matter_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/admin/matters/matter_1?");
    expect(mocks.createMatterDraftInvoice).not.toHaveBeenCalled();
  });

  it("fails closed when DATABASE_URL is unavailable", async () => {
    mocks.access = { allowed: true, principal: principal() };
    mocks.hasDatabaseUrl = false;
    const callsBefore = mocks.createMatterDraftInvoice.mock.calls.length;

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "matter_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("DATABASE_URL");
    expect(mocks.createMatterDraftInvoice).toHaveBeenCalledTimes(callsBefore);
    mocks.hasDatabaseUrl = true;
  });

  it("redirects with error when invoice creation is rejected", async () => {
    mocks.access = { allowed: true, principal: principal() };
    mocks.createResult = {
      ok: false,
      error: {
        message: "Add at least one draft billing line before creating a draft invoice."
      },
      data: undefined
    };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "matter_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("invoiceError=");
    expect(mocks.createMatterDraftInvoice).toHaveBeenCalled();
  });

  it("redirects to draft invoices after successful creation", async () => {
    mocks.access = { allowed: true, principal: principal() };
    mocks.createResult = {
      ok: true,
      error: {
        message: ""
      },
      data: {
        id: "invoice_1",
        internalDraftReference: "DRAFT-TEST-MATTER-001-20260715-ABC123"
      }
    };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "matter_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin/matters/matter_1?invoiceCreated=1#draft-invoices");
  });
});
