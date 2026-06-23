import { describe, expect, it } from "vitest";

import type { EntraAuthConfig } from "./entra-config";
import { validateEntraTokenSkeleton } from "./entra-token-validation";

const now = new Date("2026-06-23T10:00:00.000Z");
const config: Pick<EntraAuthConfig, "issuerUrl" | "clientId" | "tenantId" | "allowedEmailDomains"> = {
  issuerUrl: "https://login.microsoftonline.com/11111111-1111-4111-8111-111111111111/v2.0",
  clientId: "22222222-2222-4222-8222-222222222222",
  tenantId: "11111111-1111-4111-8111-111111111111",
  allowedEmailDomains: ["example.test"]
};
const token = {
  issuer: config.issuerUrl,
  audience: config.clientId,
  tenantId: config.tenantId,
  expiresAt: new Date("2026-06-23T10:10:00.000Z"),
  notBefore: new Date("2026-06-23T09:50:00.000Z"),
  nonce: "nonce_11111111111111111111111111111111",
  expectedNonce: "nonce_11111111111111111111111111111111",
  subject: "entra-user-1",
  email: "owner@example.test",
  jwksMetadata: {
    issuerUrl: config.issuerUrl,
    jwksUrl: `${config.issuerUrl}/discovery/v2.0/keys`,
    keyIds: ["fake-key-1"],
    fetchedAt: new Date("2026-06-23T09:55:00.000Z"),
    expiresAt: new Date("2026-06-23T10:55:00.000Z")
  }
};

describe("Microsoft Entra token validation skeleton", () => {
  it("rejects missing and wrong issuer", () => {
    expect(validateEntraTokenSkeleton({ ...token, issuer: null }, config, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(validateEntraTokenSkeleton({ ...token, issuer: "https://issuer.example.test" }, config, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects wrong audience", () => {
    expect(validateEntraTokenSkeleton({ ...token, audience: "other-client" }, config, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects expired and not-yet-valid tokens", () => {
    expect(
      validateEntraTokenSkeleton({ ...token, expiresAt: new Date("2026-06-23T09:59:59.000Z") }, config, now)
    ).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(
      validateEntraTokenSkeleton({ ...token, notBefore: new Date("2026-06-23T10:01:00.000Z") }, config, now)
    ).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects missing or wrong nonce", () => {
    expect(validateEntraTokenSkeleton({ ...token, nonce: null }, config, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(validateEntraTokenSkeleton({ ...token, nonce: "wrong_nonce_111111111111111111111111111" }, config, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects missing subject and email", () => {
    expect(validateEntraTokenSkeleton({ ...token, subject: "" }, config, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(validateEntraTokenSkeleton({ ...token, email: null }, config, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects wrong tenant and disallowed email domain", () => {
    expect(validateEntraTokenSkeleton({ ...token, tenantId: "other-tenant" }, config, now)).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
    expect(validateEntraTokenSkeleton({ ...token, email: "owner@other.example" }, config, now)).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
  });

  it("does not authenticate complete placeholder tokens without cryptographic verification", () => {
    const result = validateEntraTokenSkeleton(token, config, now);

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR",
        message: "Microsoft Entra token requires cryptographic JWKS validation before authentication."
      }
    });
  });

  it("requires JWKS metadata and rejects wrong or expired metadata", () => {
    expect(validateEntraTokenSkeleton({ ...token, jwksMetadata: null }, config, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(
      validateEntraTokenSkeleton({
        ...token,
        jwksMetadata: {
          ...token.jwksMetadata,
          issuerUrl: "https://issuer.example.test"
        }
      }, config, now)
    ).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
    expect(
      validateEntraTokenSkeleton({
        ...token,
        jwksMetadata: {
          ...token.jwksMetadata,
          expiresAt: new Date("2026-06-23T09:59:59.000Z")
        }
      }, config, now)
    ).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("does not expose raw token-like values in errors", () => {
    const secretLikeSubject = "raw-token-like-value";
    const result = validateEntraTokenSkeleton({ ...token, subject: secretLikeSubject }, config, now);

    expect(result).toMatchObject({ ok: false });
    expect(JSON.stringify(result)).not.toContain(secretLikeSubject);
  });
});
