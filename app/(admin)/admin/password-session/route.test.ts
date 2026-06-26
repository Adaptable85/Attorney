import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

function createPasswordRequest(password: string, url = "https://admin.example.test/admin/password-session") {
  const formData = new FormData();
  formData.set("password", password);

  return new Request(url, {
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

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin");
    expect(response.headers.get("location")).not.toContain("localhost:8080");
    expect(response.headers.get("location")).not.toContain("admin.example.test");
    expect(setCookie).toContain("burgess_admin_session=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=lax");
  });

  it("does not build a successful redirect from an internal localhost request URL", async () => {
    vi.stubEnv("BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED", "true");
    vi.stubEnv("BURGESS_ADMIN_PASSWORD", "correct-password");
    vi.stubEnv("BURGESS_ADMIN_SESSION_SECRET", "session-secret");

    const response = await POST(createPasswordRequest(
      "correct-password",
      "https://localhost:8080/admin/password-session"
    ));

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin");
    expect(response.headers.get("location")).not.toContain("localhost:8080");
  });
});
