import { describe, expect, it, vi } from "vitest";

import { createDisabledEntraRouteDependencies } from "./entra-route-dependencies";

describe("Microsoft Entra route dependencies", () => {
  it("returns disabled route dependencies by default", () => {
    expect(createDisabledEntraRouteDependencies({ environment: {} })).toMatchObject({
      routeBehavior: "disabled",
      reason: "entra_auth_not_enabled",
      cookiesEnabled: false,
      sessionsEnabled: false,
      redirectsEnabled: false,
      tokenExchangeEnabled: false,
      wiring: {
        enabled: false,
        reason: "staging_wiring_disabled"
      }
    });
  });

  it("keeps route dependencies disabled when config is missing", () => {
    expect(
      createDisabledEntraRouteDependencies({
        environment: {
          AUTH_PROVIDER: "entra",
          BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED: "true"
        }
      })
    ).toMatchObject({
      routeBehavior: "disabled",
      wiring: {
        enabled: false,
        reason: "config_missing"
      }
    });
  });

  it("does not call JWKS fetch or create cookie/session behavior", () => {
    const fetcher = vi.fn();
    const dependencies = createDisabledEntraRouteDependencies({ environment: {} });

    expect(fetcher).not.toHaveBeenCalled();
    expect(dependencies.cookiesEnabled).toBe(false);
    expect(dependencies.sessionsEnabled).toBe(false);
    expect(dependencies.redirectsEnabled).toBe(false);
    expect(dependencies.tokenExchangeEnabled).toBe(false);
  });
});
