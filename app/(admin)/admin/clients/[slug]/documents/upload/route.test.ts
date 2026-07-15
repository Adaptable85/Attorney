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
  uploadResult: {
    ok: false as boolean,
    error: {
      message: "Staging document uploads are not enabled for this session."
    },
    data: undefined as undefined | { id: string; filename: string }
  },
  uploadStagingClientDocument: vi.fn()
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

vi.mock("@/server/staging-documents", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/staging-documents")>();

  return {
    ...actual,
    async uploadStagingClientDocument(input: unknown) {
      mocks.uploadStagingClientDocument(input);
      return mocks.uploadResult;
    }
  };
});

import { POST } from "./route";

function createRequest() {
  const formData = new FormData();
  formData.set("documentType", "Identity");
  formData.set("matterReference", "General");
  formData.set("documentDate", "2026-07-15");
  formData.set("displayFilename", "TEST_Client_General_Identity_2026_07_15.txt");
  formData.set("file", new File(["test"], "test.txt", { type: "text/plain" }));

  return new Request("https://example.test/admin/clients/client_1/documents/upload", {
    method: "POST",
    body: formData
  });
}

describe("staging document upload route", () => {
  it("fails closed when admin is not signed in", async () => {
    mocks.access = { allowed: false, principal: null };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ slug: "client_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/admin/clients/client_1?");
    expect(mocks.uploadStagingClientDocument).not.toHaveBeenCalled();
  });

  it("redirects with error when upload is rejected", async () => {
    mocks.access = {
      allowed: true,
      principal: {
        userId: "staging_admin_password_reviewer",
        email: "staging.admin.review@example.test",
        roles: ["READ_ONLY_REVIEWER"],
        provider: "staging_admin_password"
      }
    };
    mocks.uploadResult = {
      ok: false,
      error: {
        message: "Staging document uploads are not enabled for this session."
      },
      data: undefined
    };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ slug: "client_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("uploadError=");
    expect(mocks.uploadStagingClientDocument).toHaveBeenCalled();
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
    const callsBefore = mocks.uploadStagingClientDocument.mock.calls.length;

    const response = await POST(createRequest(), {
      params: Promise.resolve({ slug: "client_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("DATABASE_URL");
    expect(mocks.uploadStagingClientDocument).toHaveBeenCalledTimes(callsBefore);
    mocks.hasDatabaseUrl = true;
  });

  it("redirects to the document panel after successful upload", async () => {
    mocks.access = {
      allowed: true,
      principal: {
        userId: "staging_admin_password_reviewer",
        email: "staging.admin.review@example.test",
        roles: ["READ_ONLY_REVIEWER"],
        provider: "staging_admin_password"
      }
    };
    mocks.uploadResult = {
      ok: true,
      error: {
        message: ""
      },
      data: {
        id: "document_1",
        filename: "TEST.txt"
      }
    };

    const response = await POST(createRequest(), {
      params: Promise.resolve({ slug: "client_1" })
    });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin/clients/client_1?uploaded=1#documents");
  });
});
