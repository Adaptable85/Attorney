import { describe, expect, it } from "vitest";

import {
  createAdminPasswordSessionCookieValue,
  createStagingAdminPasswordPrincipal,
  getAdminPasswordAccessConfig,
  getAdminPasswordCookieOptions,
  verifyAdminPassword,
  verifyAdminPasswordSessionCookieValue
} from "./admin-password-access";

const configuredEnvironment = {
  BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED: "true",
  BURGESS_ADMIN_PASSWORD: "review-password",
  BURGESS_ADMIN_SESSION_SECRET: "session-secret"
};

describe("admin password access", () => {
  it("fails closed when the explicit enablement flag is missing", () => {
    expect(getAdminPasswordAccessConfig({})).toEqual({
      enabled: false,
      configured: false,
      reason: "password_access_disabled"
    });
  });

  it("fails closed when the password or session secret is missing", () => {
    expect(
      getAdminPasswordAccessConfig({
        BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED: "true",
        BURGESS_ADMIN_PASSWORD: "review-password"
      })
    ).toEqual({
      enabled: true,
      configured: false,
      reason: "password_access_unconfigured"
    });
  });

  it("requires the configured password before creating a protected session", () => {
    const config = getAdminPasswordAccessConfig(configuredEnvironment);

    expect(verifyAdminPassword("wrong-password", config)).toBe(false);
    expect(verifyAdminPassword("review-password", config)).toBe(true);
    expect(createAdminPasswordSessionCookieValue(config)).toMatch(/\./);
  });

  it("verifies only signed and unexpired password sessions", () => {
    const now = new Date("2026-06-26T10:00:00.000Z");
    const config = getAdminPasswordAccessConfig(configuredEnvironment);
    const cookie = createAdminPasswordSessionCookieValue(config, now);

    expect(verifyAdminPasswordSessionCookieValue(cookie ?? undefined, config, now)).toEqual(
      createStagingAdminPasswordPrincipal()
    );
    expect(verifyAdminPasswordSessionCookieValue(undefined, config, now)).toBeNull();
    expect(verifyAdminPasswordSessionCookieValue("malformed", config, now)).toBeNull();
    expect(verifyAdminPasswordSessionCookieValue("bad.payload.value", config, now)).toBeNull();
    expect(verifyAdminPasswordSessionCookieValue(`${cookie ?? ""}tampered`, config, now)).toBeNull();
    expect(
      verifyAdminPasswordSessionCookieValue(cookie ?? undefined, config, new Date("2026-06-26T19:00:01.000Z"))
    ).toBeNull();
  });

  it("sets httpOnly lax cookies and requires secure cookies in production", () => {
    expect(getAdminPasswordCookieOptions("test")).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/admin"
    });
    expect(getAdminPasswordCookieOptions("production")).toMatchObject({
      secure: true
    });
  });
});
