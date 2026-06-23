import { describe, expect, it } from "vitest";

import { serviceSuccess } from "@/services/service-result";

import type { EntraAuthConfig } from "./entra-config";
import type { EntraJwtSignatureVerifier } from "./entra-jwt-verifier";
import {
  validateEntraTokenSkeleton,
  validateVerifiedEntraTokenSkeleton
} from "./entra-token-validation";

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
const fakeKeys = [{ kid: "fake-key-1", kty: "RSA", alg: "RS256", use: "sig" }] as const;

function segment(value: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function rawIdToken(claimOverrides?: Record<string, unknown>): string {
  return [
    segment({ alg: "RS256", kid: "fake-key-1", typ: "JWT" }),
    segment({
      iss: config.issuerUrl,
      aud: config.clientId,
      tid: config.tenantId,
      exp: Math.floor(token.expiresAt.getTime() / 1000),
      nbf: Math.floor(token.notBefore.getTime() / 1000),
      nonce: token.nonce,
      oid: token.subject,
      email: token.email,
      roles: "OWNER_PRINCIPAL",
      ...claimOverrides
    }),
    "local-test-signature"
  ].join(".");
}

const localVerifier: EntraJwtSignatureVerifier = () => serviceSuccess({ verified: true });

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

  it("requires a verifier for raw ID token validation", () => {
    expect(
      validateVerifiedEntraTokenSkeleton(
        {
          rawIdToken: rawIdToken(),
          expectedNonce: token.nonce,
          jwksKeys: fakeKeys,
          jwksMetadata: token.jwksMetadata
        },
        config,
        now
      )
    ).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("fails closed when verifier or verified claims fail validation", () => {
    const failingVerifier: EntraJwtSignatureVerifier = () => ({
      ok: false,
      error: { code: "UNAUTHORIZED", message: "Local test signature rejected." }
    });

    expect(
      validateVerifiedEntraTokenSkeleton(
        {
          rawIdToken: rawIdToken(),
          expectedNonce: token.nonce,
          jwksKeys: fakeKeys,
          signatureVerifier: failingVerifier,
          jwksMetadata: token.jwksMetadata
        },
        config,
        now
      )
    ).toMatchObject({ ok: false });

    expect(
      validateVerifiedEntraTokenSkeleton(
        {
          rawIdToken: rawIdToken({ nonce: "wrong_nonce_111111111111111111111111111" }),
          expectedNonce: token.nonce,
          jwksKeys: fakeKeys,
          signatureVerifier: localVerifier,
          jwksMetadata: token.jwksMetadata
        },
        config,
        now
      )
    ).toMatchObject({ ok: false });

    expect(
      validateVerifiedEntraTokenSkeleton(
        {
          rawIdToken: rawIdToken(),
          expectedNonce: token.nonce,
          jwksKeys: fakeKeys,
          signatureVerifier: localVerifier,
          jwksMetadata: null
        },
        config,
        now
      )
    ).toMatchObject({ ok: false });
  });

  it("allows only verifier-produced fake/local claims to pass structural validation", () => {
    const result = validateVerifiedEntraTokenSkeleton(
      {
        rawIdToken: rawIdToken(),
        expectedNonce: token.nonce,
        jwksKeys: fakeKeys,
        signatureVerifier: localVerifier,
        jwksMetadata: token.jwksMetadata
      },
      config,
      now
    );

    expect(result).toMatchObject({
      ok: true,
      data: {
        issuer: config.issuerUrl,
        audience: config.clientId,
        tenantId: config.tenantId,
        subject: token.subject,
        email: token.email
      }
    });
  });
});
