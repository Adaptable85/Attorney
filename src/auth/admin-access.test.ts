import { afterEach, describe, expect, it, vi } from "vitest";

import { createLocalDevAuthProvider } from "./auth-provider";
import {
  evaluateAdminAccess,
  hasAdminShellAccess,
  requireAdminAccess
} from "./admin-access";
import {
  createCurrentUserProvider,
  getCurrentPrincipal,
  getLocalDevPrincipal
} from "./current-user";

describe("admin access boundary", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows owner/principal access", () => {
    expect(
      hasAdminShellAccess({
        userId: "owner",
        email: "owner@example.test",
        roles: ["OWNER_PRINCIPAL"],
        provider: "local_dev_placeholder"
      })
    ).toBe(true);
  });

  it("allows support admin access", () => {
    expect(
      hasAdminShellAccess({
        userId: "support",
        email: "support@example.test",
        roles: ["SUPPORT_ADMIN"],
        provider: "local_dev_placeholder"
      })
    ).toBe(true);
  });

  it("blocks agent service users from normal admin shell access", () => {
    const decision = evaluateAdminAccess({
      userId: "agent",
      email: "agent@example.test",
      roles: ["AGENT_SERVICE"],
      provider: "local_dev_placeholder"
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("agent_service_blocked");
  });

  it("handles missing users safely", () => {
    expect(hasAdminShellAccess(null)).toBe(false);
    expect(evaluateAdminAccess(null)).toEqual({
      allowed: false,
      reason: "missing_user",
      principal: null
    });
  });

  it("blocks principals without an admin shell role", () => {
    expect(
      evaluateAdminAccess({
        userId: "empty",
        email: "empty@example.test",
        roles: [],
        provider: "local_dev_placeholder"
      })
    ).toMatchObject({
      allowed: false,
      reason: "missing_admin_role"
    });
  });

  it("uses the provider boundary without requiring production auth", async () => {
    const provider = createLocalDevAuthProvider({
      userId: "support",
      email: "support@example.test",
      roles: ["SUPPORT_ADMIN"],
      provider: "local_dev_placeholder"
    });

    await expect(requireAdminAccess(provider)).resolves.toMatchObject({
      allowed: true,
      reason: "allowed"
    });
  });

  it("does not create a local dev principal in production mode", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(getLocalDevPrincipal()).toBeNull();
  });

  it("creates a support admin local principal by default outside production", () => {
    vi.stubEnv("NODE_ENV", "test");

    expect(getLocalDevPrincipal()).toMatchObject({
      email: "local.dev.admin@example.test",
      roles: ["SUPPORT_ADMIN"],
      provider: "local_dev_placeholder"
    });
  });

  it("uses explicit local dev role env values", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("BURGESS_DEV_CURRENT_ROLE", "OWNER_PRINCIPAL");

    expect(getLocalDevPrincipal()).toMatchObject({
      userId: "local_dev_owner_principal",
      roles: ["OWNER_PRINCIPAL"]
    });
  });

  it("supports explicit no-user local dev mode", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("BURGESS_DEV_CURRENT_ROLE", "none");

    expect(getLocalDevPrincipal()).toBeNull();
  });

  it("fails closed for unsupported local dev role env values", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("BURGESS_DEV_CURRENT_ROLE", "UNSUPPORTED");

    expect(getLocalDevPrincipal()).toBeNull();
  });

  it("creates and reads the current local provider without production auth", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("BURGESS_DEV_CURRENT_ROLE", "READ_ONLY_REVIEWER");

    await expect(getCurrentPrincipal(createCurrentUserProvider())).resolves.toMatchObject({
      roles: ["READ_ONLY_REVIEWER"],
      provider: "local_dev_placeholder"
    });
  });
});
