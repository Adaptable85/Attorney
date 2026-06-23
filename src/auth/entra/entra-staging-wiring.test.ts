import { describe, expect, it } from "vitest";

import { evaluateClientMatterWriteGate, readReleaseGateConfig } from "@/config/release-gates";

import { createEntraStagingWiring } from "./entra-staging-wiring";

const placeholderSecret = "placeholder-client-secret";
const completeEnvironment = {
  AUTH_PROVIDER: "entra",
  AUTH_ENTRA_TENANT_ID: "11111111-1111-4111-8111-111111111111",
  AUTH_ENTRA_CLIENT_ID: "22222222-2222-4222-8222-222222222222",
  AUTH_ENTRA_CLIENT_SECRET: placeholderSecret,
  AUTH_ENTRA_REDIRECT_URI: "https://admin.example.test/api/auth/entra/callback",
  AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS: "example.test",
  AUTH_ENTRA_ROLE_CLAIM: "roles"
} as const;

describe("Microsoft Entra staging wiring", () => {
  it("is disabled by default", () => {
    expect(createEntraStagingWiring({ environment: {} })).toMatchObject({
      enabled: false,
      reason: "staging_wiring_disabled",
      liveLoginEnabled: false,
      productionAuthReady: false,
      productionWritesEnabled: false
    });
  });

  it("does not treat AUTH_PROVIDER=entra alone as enabled", () => {
    expect(createEntraStagingWiring({ environment: { AUTH_PROVIDER: "entra" } })).toMatchObject({
      enabled: false,
      reason: "staging_wiring_disabled"
    });
  });

  it("keeps complete placeholder config disabled unless the staging wiring flag is explicit", () => {
    const result = createEntraStagingWiring({ environment: completeEnvironment });

    expect(result).toMatchObject({
      enabled: false,
      reason: "staging_wiring_disabled"
    });
    expect(JSON.stringify(result)).not.toContain(placeholderSecret);
  });

  it("fails closed when the staging wiring flag is enabled without complete config", () => {
    expect(
      createEntraStagingWiring({
        environment: {
          AUTH_PROVIDER: "entra",
          BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED: "true"
        }
      })
    ).toMatchObject({
      enabled: false,
      reason: "config_missing",
      productionAuthReady: false
    });
  });

  it("fails closed when cryptographic verification dependency is unavailable", () => {
    expect(
      createEntraStagingWiring({
        environment: {
          ...completeEnvironment,
          BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED: "true"
        }
      })
    ).toMatchObject({
      enabled: false,
      reason: "crypto_verification_missing",
      liveLoginEnabled: false,
      productionWritesEnabled: false
    });
  });

  it("returns a non-live dependency bundle when explicitly enabled and dependency markers exist", async () => {
    const result = createEntraStagingWiring({
      environment: {
        ...completeEnvironment,
        BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED: "true",
        BURGESS_PRODUCTION_AUTH_CONFIGURED: "true",
        BURGESS_PRODUCTION_WRITES_ENABLED: "true"
      },
      cryptoVerificationDependencyAvailable: true
    });

    expect(result).toMatchObject({
      enabled: true,
      config: {
        provider: "microsoft_entra_id",
        clientSecretConfigured: true
      },
      tokenValidation: {
        dependencyAvailable: true,
        authenticatesTokens: false
      },
      liveLoginEnabled: false,
      productionAuthReady: false,
      productionWritesEnabled: false
    });

    if (!result.enabled) {
      throw new Error("Expected staging wiring to be enabled for dependency assertions.");
    }

    expect(JSON.stringify(result)).not.toContain(placeholderSecret);
    expect(result.pkce.generateVerifier()).toHaveLength(86);
    await expect(result.jwksCache.get(result.config.issuerUrl)).resolves.toMatchObject({
      ok: false
    });

    const writeGate = evaluateClientMatterWriteGate(
      readReleaseGateConfig({
        environment: "production",
        env: {
          BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED: "true",
          BURGESS_PRODUCTION_AUTH_CONFIGURED: "true",
          BURGESS_PRODUCTION_WRITES_ENABLED: "true",
          BURGESS_CLIENT_MATTER_WRITES_ENABLED: "true",
          BURGESS_AUDITED_PERSISTENCE_ENABLED: "true"
        },
        productionAuthReady: result.productionAuthReady
      })
    );

    expect(writeGate).toEqual({ enabled: false, reason: "production_auth_missing" });
  });
});
