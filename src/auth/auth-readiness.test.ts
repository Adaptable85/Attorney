import { describe, expect, it } from "vitest";

import { readProductionAuthConfig } from "./auth-config";
import { readProductionAuthReadiness } from "./auth-readiness";

describe("production auth readiness", () => {
  it("is false by default and does not require real secrets in tests", () => {
    expect(readProductionAuthReadiness({})).toEqual({ ready: false, reason: "provider_missing" });
  });

  it("fails closed for unknown and local/dev providers", () => {
    expect(
      readProductionAuthReadiness({
        BURGESS_PRODUCTION_AUTH_PROVIDER: "custom_provider",
        BURGESS_PRODUCTION_AUTH_ENABLED: "true"
      })
    ).toEqual({ ready: false, reason: "provider_unknown" });
    expect(
      readProductionAuthReadiness({
        BURGESS_PRODUCTION_AUTH_PROVIDER: "local_dev_placeholder",
        BURGESS_PRODUCTION_AUTH_ENABLED: "true"
      })
    ).toEqual({ ready: false, reason: "provider_not_production" });
  });

  it("requires explicit production auth enablement", () => {
    expect(
      readProductionAuthReadiness({
        BURGESS_PRODUCTION_AUTH_PROVIDER: "microsoft_entra_id"
      })
    ).toEqual({ ready: false, reason: "explicit_enablement_missing" });
    expect(
      readProductionAuthReadiness({
        BURGESS_PRODUCTION_AUTH_PROVIDER: "microsoft_entra_id",
        BURGESS_PRODUCTION_AUTH_ENABLED: "true"
      })
    ).toEqual({ ready: true, provider: "microsoft_entra_id" });
  });

  it("never exposes secret-like environment values in config", () => {
    const config = readProductionAuthConfig({
      BURGESS_PRODUCTION_AUTH_PROVIDER: "auth0",
      BURGESS_PRODUCTION_AUTH_ENABLED: "true",
      BURGESS_PRODUCTION_AUTH_UNUSED_SENSITIVE_VALUE: "sensitive-test-value"
    });

    expect(config).toEqual({ provider: "auth0", explicitlyEnabled: true });
    expect(JSON.stringify(config)).not.toContain("sensitive-test-value");
  });
});
