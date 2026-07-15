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
  saveResult: {
    ok: false as boolean,
    error: {
      message: "Staging billing item edits are not enabled for this session."
    },
    data: undefined as undefined | { id: string; label: string }
  },
  saveBillingItemTemplate: vi.fn()
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

vi.mock("@/server/staging-billing-items", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/staging-billing-items")>();

  return {
    ...actual,
    async saveBillingItemTemplate(input: unknown) {
      mocks.saveBillingItemTemplate(input);
      return mocks.saveResult;
    }
  };
});

import { POST } from "./route";

function createRequest() {
  const formData = new FormData();
  formData.set("label", "Consultation");
  formData.set("category", "TIME");
  formData.set("description", "Consultation item");
  formData.set("amountCents", "85000");
  formData.set("vatTreatment", "VAT_ON_FEES");
  formData.set("status", "ACTIVE");

  return new Request("https://example.test/admin/invoice-items/create", {
    method: "POST",
    body: formData
  });
}

describe("staging billing item create route", () => {
  it("fails closed when admin is not signed in", async () => {
    mocks.access = { allowed: false, principal: null };

    const response = await POST(createRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/admin/invoice-items?");
    expect(mocks.saveBillingItemTemplate).not.toHaveBeenCalled();
  });

  it("redirects with error when save is rejected", async () => {
    mocks.access = {
      allowed: true,
      principal: {
        userId: "staging_admin_password_reviewer",
        email: "staging.admin.review@example.test",
        roles: ["READ_ONLY_REVIEWER"],
        provider: "staging_admin_password"
      }
    };
    mocks.saveResult = {
      ok: false,
      error: {
        message: "Staging billing item edits are not enabled for this session."
      },
      data: undefined
    };

    const response = await POST(createRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("error=");
    expect(mocks.saveBillingItemTemplate).toHaveBeenCalled();
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
    const callsBefore = mocks.saveBillingItemTemplate.mock.calls.length;

    const response = await POST(createRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("DATABASE_URL");
    expect(mocks.saveBillingItemTemplate).toHaveBeenCalledTimes(callsBefore);
    mocks.hasDatabaseUrl = true;
  });

  it("redirects after successful save", async () => {
    mocks.access = {
      allowed: true,
      principal: {
        userId: "staging_admin_password_reviewer",
        email: "staging.admin.review@example.test",
        roles: ["READ_ONLY_REVIEWER"],
        provider: "staging_admin_password"
      }
    };
    mocks.saveResult = {
      ok: true,
      error: {
        message: ""
      },
      data: {
        id: "template_1",
        label: "Consultation"
      }
    };

    const response = await POST(createRequest());

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin/invoice-items?saved=1");
  });
});
