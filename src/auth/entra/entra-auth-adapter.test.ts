import { describe, expect, it } from "vitest";

import { evaluateClientMatterWriteGate, readReleaseGateConfig } from "@/config/release-gates";
import { createEntraAuthAdapter } from "./entra-auth-adapter";

const placeholderSecret = "placeholder-client-secret";
const completeEnvironment = {
  AUTH_PROVIDER: "entra",
  AUTH_ENTRA_TENANT_ID: "11111111-1111-4111-8111-111111111111",
  AUTH_ENTRA_CLIENT_ID: "22222222-2222-4222-8222-222222222222",
  AUTH_ENTRA_CLIENT_SECRET: placeholderSecret,
  AUTH_ENTRA_REDIRECT_URI: "https://admin.example.test/api/auth/entra/callback",
  AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS: "example.test",
  AUTH_ENTRA_ROLE_CLAIM: "roles",
  BURGESS_PRODUCTION_AUTH_PROVIDER: "microsoft_entra_id",
  BURGESS_PRODUCTION_AUTH_ENABLED: "true"
} as const;

describe("Microsoft Entra auth adapter skeleton", () => {
  it("is not ready without config", async () => {
    const adapter = createEntraAuthAdapter({ environment: {} });

    expect(adapter.configReadiness).toMatchObject({ ready: false, reason: "provider_missing" });
    await expect(adapter.getCurrentPrincipal()).resolves.toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("is config-ready only with complete placeholder config but does not enable writes by itself", () => {
    const adapter = createEntraAuthAdapter({ environment: completeEnvironment });

    expect(adapter.configReadiness).toMatchObject({ ready: true });
    expect(adapter.productionReadiness).toEqual({ ready: true, provider: "microsoft_entra_id" });
    expect(JSON.stringify(adapter)).not.toContain(placeholderSecret);

    const writeGate = evaluateClientMatterWriteGate(
      readReleaseGateConfig({
        environment: "production",
        productionAuthReady: adapter.productionReadiness.ready,
        flags: {
          clientMatterWritesEnabled: true,
          auditedPersistenceEnabled: true,
          productionAuthConfigured: true,
          productionWritesEnabled: false,
          localDevWritesEnabled: false,
          devMutationEntrypointsEnabled: false,
          entraStagingAuthWiringEnabled: false
        }
      })
    );

    expect(writeGate).toEqual({ enabled: false, reason: "production_writes_disabled" });
  });

  it("maps claims through the Entra claim mapper", () => {
    const adapter = createEntraAuthAdapter({ environment: completeEnvironment });
    const result = adapter.mapClaims({
      oid: "entra-user-1",
      email: "owner@example.test",
      tid: "11111111-1111-4111-8111-111111111111",
      roles: ["OWNER_PRINCIPAL"]
    });

    expect(result).toMatchObject({ ok: true });
    expect(result.ok && result.data.roles).toEqual(["OWNER_PRINCIPAL"]);
  });

  it("loads current principal only through the configured claim loader", async () => {
    const adapter = createEntraAuthAdapter({
      environment: completeEnvironment,
      async loadClaims() {
        return {
          oid: "entra-user-1",
          email: "owner@example.test",
          tid: "11111111-1111-4111-8111-111111111111",
          roles: ["OWNER_PRINCIPAL"]
        };
      }
    });

    await expect(adapter.getCurrentPrincipal()).resolves.toMatchObject({
      ok: true,
      data: {
        userId: "entra-user-1",
        roles: ["OWNER_PRINCIPAL"]
      }
    });
  });

  it("returns a disabled live-login result when no claim loader exists", async () => {
    const adapter = createEntraAuthAdapter({ environment: completeEnvironment });

    await expect(adapter.getCurrentPrincipal()).resolves.toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR",
        message: "Microsoft Entra live login is not implemented."
      }
    });
  });

  it("fails closed on bad config", () => {
    const adapter = createEntraAuthAdapter({
      environment: { ...completeEnvironment, AUTH_ENTRA_TENANT_ID: "not a tenant" }
    });

    expect(adapter.configReadiness).toMatchObject({ ready: false, reason: "tenant_id_invalid" });
    expect(
      adapter.mapClaims({
        oid: "entra-user-1",
        email: "owner@example.test",
        roles: ["OWNER_PRINCIPAL"]
      })
    ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
  });

  it("does not include secret values in errors", async () => {
    const adapter = createEntraAuthAdapter({
      environment: { ...completeEnvironment, AUTH_ENTRA_CLIENT_SECRET: undefined }
    });
    const result = await adapter.getCurrentPrincipal();

    expect(result).toMatchObject({ ok: false });
    expect(JSON.stringify(adapter.configReadiness)).not.toContain(placeholderSecret);
    expect(JSON.stringify(result)).not.toContain(placeholderSecret);
  });
});
