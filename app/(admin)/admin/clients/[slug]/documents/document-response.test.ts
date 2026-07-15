import { beforeEach, describe, expect, it, vi } from "vitest";

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
  documentResult: {
    ok: true as boolean,
    data: {
      id: "document_1",
      filename: "TEST_Document.txt",
      contentType: "text/plain",
      sizeBytes: 4,
      bytes: new Uint8Array([116, 101, 115, 116])
    },
    error: {
      code: "NOT_FOUND",
      message: "Document was not found for this client file."
    }
  },
  getStagingClientDocumentContent: vi.fn()
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

vi.mock("@/server/staging-documents", () => ({
  async getStagingClientDocumentContent(input: unknown) {
    mocks.getStagingClientDocumentContent(input);
    return mocks.documentResult;
  }
}));

import { createDocumentResponse } from "./document-response";

describe("staging document response", () => {
  const principal = {
    userId: "staging_admin_password_reviewer",
    email: "staging.admin.review@example.test",
    roles: ["READ_ONLY_REVIEWER"] as ["READ_ONLY_REVIEWER"],
    provider: "staging_admin_password" as const
  };

  beforeEach(() => {
    mocks.access = { allowed: false, principal: null };
    mocks.hasDatabaseUrl = true;
    mocks.documentResult = {
      ok: true,
      data: {
        id: "document_1",
        filename: "TEST_Document.txt",
        contentType: "text/plain",
        sizeBytes: 4,
        bytes: new Uint8Array([116, 101, 115, 116])
      },
      error: {
        code: "NOT_FOUND",
        message: "Document was not found for this client file."
      }
    };
    mocks.getStagingClientDocumentContent.mockClear();
  });

  it("fails closed when admin is not signed in", async () => {
    mocks.access = { allowed: false, principal: null };

    const response = await createDocumentResponse({
      clientId: "client_1",
      documentId: "document_1",
      action: "view"
    });

    expect(response.status).toBe(401);
    expect(await response.text()).toContain("Admin sign-in is required");
    expect(mocks.getStagingClientDocumentContent).not.toHaveBeenCalled();
  });

  it("returns an inline private response for document view", async () => {
    mocks.access = { allowed: true, principal };

    const response = await createDocumentResponse({
      clientId: "client_1",
      documentId: "document_1",
      action: "view"
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/plain");
    expect(response.headers.get("content-length")).toBe("4");
    expect(response.headers.get("content-disposition")).toBe("inline; filename=\"TEST_Document.txt\"");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.text()).toBe("test");
    expect(mocks.getStagingClientDocumentContent).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: "client_1",
        documentId: "document_1",
        action: "view"
      })
    );
  });

  it("returns an attachment response for document download", async () => {
    mocks.access = { allowed: true, principal };
    mocks.documentResult = {
      ...mocks.documentResult,
      data: {
        ...mocks.documentResult.data,
        filename: "Unsafe\"Name.txt"
      }
    };

    const response = await createDocumentResponse({
      clientId: "client_1",
      documentId: "document_1",
      action: "download"
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-disposition")).toBe("attachment; filename=\"Unsafe_Name.txt\"");
    expect(await response.text()).toBe("test");
  });

  it("returns not found for missing or wrong-client documents", async () => {
    mocks.access = { allowed: true, principal };
    mocks.documentResult = {
      ok: false,
      data: {
        id: "",
        filename: "",
        contentType: "",
        sizeBytes: 0,
        bytes: new Uint8Array()
      },
      error: {
        code: "NOT_FOUND",
        message: "Document was not found for this client file."
      }
    };

    const response = await createDocumentResponse({
      clientId: "client_1",
      documentId: "missing_document",
      action: "view"
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Document was not found");
  });

  it("returns forbidden for gate or authorization failures", async () => {
    mocks.access = { allowed: true, principal };
    mocks.documentResult = {
      ok: false,
      data: {
        id: "",
        filename: "",
        contentType: "",
        sizeBytes: 0,
        bytes: new Uint8Array()
      },
      error: {
        code: "UNAUTHORIZED",
        message: "Staging document access is not enabled for this session."
      }
    };

    const response = await createDocumentResponse({
      clientId: "client_1",
      documentId: "document_1",
      action: "view"
    });

    expect(response.status).toBe(403);
    expect(await response.text()).toContain("not enabled");
  });


  it("fails closed when DATABASE_URL is unavailable", async () => {
    mocks.access = { allowed: true, principal };
    mocks.hasDatabaseUrl = false;

    const response = await createDocumentResponse({
      clientId: "client_1",
      documentId: "document_1",
      action: "download"
    });

    expect(response.status).toBe(503);
    expect(await response.text()).toContain("DATABASE_URL");
    mocks.hasDatabaseUrl = true;
  });
});
