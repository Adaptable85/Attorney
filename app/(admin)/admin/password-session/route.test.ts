import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

function createPasswordRequest(password: string) {
  const formData = new FormData();
  formData.set("password", password);

  return new Request("https://admin.example.test/admin/password-session", {
    method: "POST",
    body: formData
  });
}

describe("admin password session route", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails closed when password access is not configured", async () => {
    const response = await POST(createPasswordRequest("anything"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/admin/sign-in?error=invalid");
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("rejects an incorrect password without setting a session cookie", async () => {
    vi.stubEnv("BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED", "true");
    vi.stubEnv("BURGESS_ADMIN_PASSWORD", "correct-password");
    vi.stubEnv("BURGESS_ADMIN_SESSION_SECRET", "session-secret");

    const response = await POST(createPasswordRequest("wrong-password"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/admin/sign-in?error=invalid");
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("sets an httpOnly staging admin session for the correct password", async () => {
    vi.stubEnv("BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED", "true");
    vi.stubEnv("BURGESS_ADMIN_PASSWORD", "correct-password");
    vi.stubEnv("BURGESS_ADMIN_SESSION_SECRET", "session-secret");

    const response = await POST(createPasswordRequest("correct-password"));
    const setCookie = response.headers.get("set-cookie");

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://admin.example.test/admin");
    expect(setCookie).toContain("burgess_admin_session=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=lax");
  });
});
