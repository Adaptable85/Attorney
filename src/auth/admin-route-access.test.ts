import { afterEach, describe, expect, it, vi } from "vitest";

import {
  adminPasswordSessionCookieName,
  createAdminPasswordSessionCookieValue,
  getAdminPasswordAccessConfig
} from "./admin-password-access";
import { requireAdminRouteAccess } from "./admin-route-access";

const cookieStore = vi.hoisted(() => ({
  value: undefined as string | undefined
}));

vi.mock("next/headers", () => ({
  async cookies() {
    return {
      get(name: string) {
        return name === adminPasswordSessionCookieName && cookieStore.value
          ? { value: cookieStore.value }
          : undefined;
      }
    };
  }
}));

describe("admin route access", () => {
  afterEach(() => {
    cookieStore.value = undefined;
    vi.unstubAllEnvs();
  });

  it("fails closed when password access is disabled", async () => {
    await expect(requireAdminRouteAccess()).resolves.toMatchObject({
      allowed: false,
      reason: "password_access_disabled"
    });
  });

  it("fails closed when password access is enabled but unconfigured", async () => {
    vi.stubEnv("BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED", "true");

    await expect(requireAdminRouteAccess()).resolves.toMatchObject({
      allowed: false,
      reason: "password_access_unconfigured"
    });
  });

  it("requires a signed password session cookie when configured", async () => {
    vi.stubEnv("BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED", "true");
    vi.stubEnv("BURGESS_ADMIN_PASSWORD", "correct-password");
    vi.stubEnv("BURGESS_ADMIN_SESSION_SECRET", "session-secret");

    await expect(requireAdminRouteAccess()).resolves.toMatchObject({
      allowed: false,
      reason: "password_required"
    });
  });

  it("allows a signed password session as read-only reviewer access", async () => {
    vi.stubEnv("BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED", "true");
    vi.stubEnv("BURGESS_ADMIN_PASSWORD", "correct-password");
    vi.stubEnv("BURGESS_ADMIN_SESSION_SECRET", "session-secret");
    cookieStore.value = createAdminPasswordSessionCookieValue(
      getAdminPasswordAccessConfig({
        BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED: "true",
        BURGESS_ADMIN_PASSWORD: "correct-password",
        BURGESS_ADMIN_SESSION_SECRET: "session-secret"
      })
    ) ?? undefined;

    await expect(requireAdminRouteAccess()).resolves.toMatchObject({
      allowed: true,
      reason: "allowed",
      principal: {
        roles: ["READ_ONLY_REVIEWER"],
        provider: "staging_admin_password"
      }
    });
  });
});
