import { describe, expect, it } from "vitest";

import { evaluateClientMatterWriteGate, readReleaseGateConfig } from "@/config/release-gates";
import { readEntraAuthConfig } from "./entra-config";

const placeholderSecret = "placeholder-client-secret";
const baseEnvironment = {
  AUTH_PROVIDER: "entra",
  AUTH_ENTRA_TENANT_ID: "11111111-1111-4111-8111-111111111111",
  AUTH_ENTRA_CLIENT_ID: "22222222-2222-4222-8222-222222222222",
  AUTH_ENTRA_CLIENT_SECRET: placeholderSecret,
  AUTH_ENTRA_REDIRECT_URI: "https://admin.example.test/api/auth/entra/callback",
  AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS: "example.test",
  AUTH_ENTRA_ROLE_CLAIM: "roles"
} as const;

function withoutKey<K extends keyof typeof baseEnvironment>(
  key: K
): Omit<typeof baseEnvironment, K> {
  const environment = { ...baseEnvironment };

  delete environment[key];

  return environment;
}

describe("Microsoft Entra config parser", () => {
  it("fails closed when tenant ID is missing", () => {
    expect(readEntraAuthConfig(withoutKey("AUTH_ENTRA_TENANT_ID"))).toMatchObject({
      ready: false,
      reason: "tenant_id_missing"
    });
  });

  it("fails closed when client ID is missing", () => {
    expect(readEntraAuthConfig(withoutKey("AUTH_ENTRA_CLIENT_ID"))).toMatchObject({
      ready: false,
      reason: "client_id_missing"
    });
  });

  it("fails closed when client secret is missing without exposing secret values", () => {
    const result = readEntraAuthConfig(withoutKey("AUTH_ENTRA_CLIENT_SECRET"));

    expect(result).toMatchObject({
      ready: false,
      reason: "client_secret_missing"
    });
    expect(JSON.stringify(result)).not.toContain(placeholderSecret);
  });

  it("fails closed when redirect URI is missing", () => {
    expect(readEntraAuthConfig(withoutKey("AUTH_ENTRA_REDIRECT_URI"))).toMatchObject({
      ready: false,
      reason: "redirect_uri_missing"
    });
  });

  it("fails closed for invalid allowed domains", () => {
    expect(
      readEntraAuthConfig({
        ...baseEnvironment,
        AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS: "not a domain"
      })
    ).toMatchObject({
      ready: false,
      reason: "allowed_email_domain_invalid"
    });
  });

  it("fails closed for invalid redirect URI and missing role claim", () => {
    expect(
      readEntraAuthConfig({
        ...baseEnvironment,
        AUTH_ENTRA_REDIRECT_URI: "ftp://admin.example.test/callback"
      })
    ).toMatchObject({
      ready: false,
      reason: "redirect_uri_invalid"
    });

    expect(readEntraAuthConfig(withoutKey("AUTH_ENTRA_ROLE_CLAIM"))).toMatchObject({
      ready: false,
      reason: "role_claim_missing"
    });
  });

  it("fails closed when allowed domains are missing", () => {
    expect(readEntraAuthConfig(withoutKey("AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS"))).toMatchObject({
      ready: false,
      reason: "allowed_email_domains_missing"
    });
  });

  it("fails closed when configured issuer does not match tenant", () => {
    expect(
      readEntraAuthConfig({
        ...baseEnvironment,
        AUTH_ENTRA_ISSUER_URL:
          "https://login.microsoftonline.com/33333333-3333-4333-8333-333333333333/v2.0"
      })
    ).toMatchObject({
      ready: false,
      reason: "tenant_id_invalid"
    });
  });

  it("fails closed for unknown providers", () => {
    expect(readEntraAuthConfig({ ...baseEnvironment, AUTH_PROVIDER: "custom" })).toMatchObject({
      ready: false,
      reason: "provider_unknown"
    });
  });

  it("does not treat AUTH_PROVIDER=entra alone as ready", () => {
    expect(readEntraAuthConfig({ AUTH_PROVIDER: "entra" })).toMatchObject({
      ready: false,
      reason: "tenant_id_missing"
    });
  });

  it("returns complete placeholder config without enabling writes by itself", () => {
    const result = readEntraAuthConfig(baseEnvironment);

    expect(result).toMatchObject({
      ready: true,
      config: {
        provider: "microsoft_entra_id",
        clientSecretConfigured: true,
        allowedEmailDomains: ["example.test"]
      }
    });
    expect(JSON.stringify(result)).not.toContain(placeholderSecret);

    const writeGate = evaluateClientMatterWriteGate(
      readReleaseGateConfig({
        environment: "production",
        flags: {
          clientMatterWritesEnabled: true,
          auditedPersistenceEnabled: true,
          productionAuthConfigured: false,
          productionWritesEnabled: false,
          localDevWritesEnabled: false,
          devMutationEntrypointsEnabled: false,
          entraStagingAuthWiringEnabled: false
        }
      })
    );

    expect(writeGate).toEqual({ enabled: false, reason: "production_auth_missing" });
  });

  it("supports Burgess-prefixed placeholder names for future deployment config", () => {
    const result = readEntraAuthConfig({
      BURGESS_PRODUCTION_AUTH_PROVIDER: "microsoft_entra_id",
      BURGESS_PRODUCTION_AUTH_TENANT_ID: baseEnvironment.AUTH_ENTRA_TENANT_ID,
      BURGESS_PRODUCTION_AUTH_CLIENT_ID: baseEnvironment.AUTH_ENTRA_CLIENT_ID,
      BURGESS_PRODUCTION_AUTH_CLIENT_SECRET: placeholderSecret,
      BURGESS_PRODUCTION_AUTH_REDIRECT_URI: baseEnvironment.AUTH_ENTRA_REDIRECT_URI,
      BURGESS_PRODUCTION_AUTH_ALLOWED_EMAIL_DOMAIN: "Example.Test",
      BURGESS_PRODUCTION_AUTH_ROLE_CLAIM: "roles"
    });

    expect(result).toMatchObject({
      ready: true,
      config: {
        provider: "microsoft_entra_id",
        allowedEmailDomains: ["example.test"]
      }
    });
  });
});
