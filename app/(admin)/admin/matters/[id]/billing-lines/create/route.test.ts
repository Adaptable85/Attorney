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
      message: "Staging matter invoice writes are not enabled for this session."
    },
    data: undefined as undefined | { id: string }
  },
  addMatterDraftBillingLine: vi.fn()
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

vi.mock("@/server/staging-matter-invoices", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/staging-matter-invoices")>();

  return {
    ...actual,
    async addMatterDraftBillingLine(input: unknown) {
      mocks.addMatterDraftBillingLine(input);
      return mocks.saveResult;
    }
  };
});

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
  const formData = new FormData();
  formData.set("description", "Consultation");
  formData.set("category", "TIME");
  formData.set("quantity", "1");
  formData.set("unitAmountCents", "85000");
  formData.set("vatTreatment", "VAT_ON_FEES");

  return new Request("https://example.test/admin/matters/matter_1/billing-lines/create", {
    method: "POST",
    body: formData
  });
}

describe("staging matter billing line route", () => {
  it("fails closed when admin is not signed in", async () => {
    mocks.access = { allowed: false, principal: null };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "matter_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/admin/matters/matter_1?");
    expect(mocks.addMatterDraftBillingLine).not.toHaveBeenCalled();
  });

  it("fails closed when DATABASE_URL is unavailable", async () => {
    mocks.access = { allowed: true, principal: principal() };
    mocks.hasDatabaseUrl = false;
    const callsBefore = mocks.addMatterDraftBillingLine.mock.calls.length;

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "matter_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("DATABASE_URL");
    expect(mocks.addMatterDraftBillingLine).toHaveBeenCalledTimes(callsBefore);
    mocks.hasDatabaseUrl = true;
  });

  it("redirects with error when save is rejected", async () => {
    mocks.access = { allowed: true, principal: principal() };
    mocks.saveResult = {
      ok: false,
      error: {
        message: "Staging matter invoice writes are not enabled for this session."
      },
      data: undefined
    };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "matter_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("billingError=");
    expect(mocks.addMatterDraftBillingLine).toHaveBeenCalled();
  });

  it("redirects to billing items after successful save", async () => {
    mocks.access = { allowed: true, principal: principal() };
    mocks.saveResult = {
      ok: true,
      error: {
        message: ""
      },
      data: {
        id: "billing_line_1"
      }
    };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "matter_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin/matters/matter_1?billingLineAdded=1#billing-items");
  });
});
