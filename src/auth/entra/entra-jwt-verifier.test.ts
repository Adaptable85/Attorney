import { describe, expect, it } from "vitest";

import { serviceFailure, serviceSuccess } from "@/services/service-result";

import { verifyEntraJwt, type EntraJwtSignatureVerifier } from "./entra-jwt-verifier";

const now = new Date("2026-06-23T10:00:00.000Z");
const expectedIssuer = "https://login.microsoftonline.com/11111111-1111-4111-8111-111111111111/v2.0";
const expectedAudience = "22222222-2222-4222-8222-222222222222";
const expectedTenantId = "11111111-1111-4111-8111-111111111111";
const expectedNonce = "nonce_11111111111111111111111111111111";
const fakeKeys = [{ kid: "fake-key-1", kty: "RSA", alg: "RS256", use: "sig" }] as const;

function segment(value: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function token(options?: {
  header?: Record<string, unknown>;
  claims?: Record<string, unknown>;
  signature?: string;
}): string {
  return [
    segment({ alg: "RS256", kid: "fake-key-1", typ: "JWT", ...options?.header }),
    segment({
      iss: expectedIssuer,
      aud: expectedAudience,
      tid: expectedTenantId,
      exp: Math.floor(new Date("2026-06-23T10:10:00.000Z").getTime() / 1000),
      nbf: Math.floor(new Date("2026-06-23T09:50:00.000Z").getTime() / 1000),
      nonce: expectedNonce,
      oid: "entra-user-1",
      email: "owner@example.test",
      roles: "OWNER_PRINCIPAL",
      ...options?.claims
    }),
    options?.signature ?? "local-test-signature"
  ].join(".");
}

const localVerifier: EntraJwtSignatureVerifier = (input) =>
  input.rawIdToken.endsWith(".local-test-signature")
    ? serviceSuccess({ verified: true })
    : serviceFailure({ code: "UNAUTHORIZED", message: "Local test signature was rejected." });

function verify(rawIdToken: string, verifier: EntraJwtSignatureVerifier = localVerifier) {
  return verifyEntraJwt({
    rawIdToken,
    expectedIssuer,
    expectedAudience,
    expectedTenantId,
    expectedNonce,
    keys: fakeKeys,
    signatureVerifier: verifier,
    now
  });
}

describe("Microsoft Entra JWT verifier boundary", () => {
  it("rejects missing, malformed and unsigned tokens", () => {
    expect(verifyEntraJwt({
      rawIdToken: "",
      expectedIssuer,
      expectedAudience,
      expectedTenantId,
      expectedNonce,
      keys: fakeKeys,
      signatureVerifier: localVerifier,
      now
    })).toMatchObject({ ok: false });
    expect(verify("not-a-jwt")).toMatchObject({ ok: false });
    expect(verify(`${segment({ alg: "none", kid: "fake-key-1" })}.${segment({})}.`)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(verify(`${segment({ alg: "RS256", kid: "fake-key-1" })}.not-json.local-test-signature`)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(verify(`${segment({ alg: "RS256", kid: "fake-key-1" })}.${segment([] as unknown as Record<string, unknown>)}.local-test-signature`)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects wrong algorithm, missing kid and unknown kid before verifier use", () => {
    expect(verify(token({ header: { alg: "HS256" } }))).toMatchObject({ ok: false });
    expect(verify(token({ header: { kid: undefined } }))).toMatchObject({ ok: false });
    expect(verify(token({ header: { kid: "unknown-key" } }))).toMatchObject({ ok: false });
  });

  it("fails closed when no cryptographic verifier is configured or verifier rejects", () => {
    expect(verifyEntraJwt({
      rawIdToken: token(),
      expectedIssuer,
      expectedAudience,
      expectedTenantId,
      expectedNonce,
      keys: fakeKeys,
      now
    })).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(verify(token({ signature: "bad-signature" }))).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects wrong issuer, audience, expiry and nonce after local verification", () => {
    expect(verify(token({ claims: { iss: "https://issuer.example.test" } }))).toMatchObject({ ok: false });
    expect(verify(token({ claims: { aud: "other-client" } }))).toMatchObject({ ok: false });
    expect(verify(token({ claims: { tid: "other-tenant" } }))).toMatchObject({ ok: false });
    expect(
      verify(token({ claims: { exp: Math.floor(new Date("2026-06-23T09:59:59.000Z").getTime() / 1000) } }))
    ).toMatchObject({ ok: false });
    expect(
      verify(token({ claims: { nbf: Math.floor(new Date("2026-06-23T10:01:00.000Z").getTime() / 1000) } }))
    ).toMatchObject({ ok: false });
    expect(verify(token({ claims: { nonce: "wrong_nonce_111111111111111111111111111" } }))).toMatchObject({
      ok: false
    });
  });

  it("rejects missing subject and email after local verification", () => {
    expect(verify(token({ claims: { oid: undefined, sub: undefined } }))).toMatchObject({ ok: false });
    expect(
      verify(token({ claims: { email: undefined, preferred_username: undefined, upn: undefined } }))
    ).toMatchObject({ ok: false });
  });

  it("returns verified claims only through the injected local verifier", () => {
    expect(verify(token())).toMatchObject({
      ok: true,
      data: {
        issuer: expectedIssuer,
        tenantId: expectedTenantId,
        nonce: expectedNonce,
        subject: "entra-user-1",
        email: "owner@example.test"
      }
    });
  });

  it("supports array audience and fallback subject/email claims", () => {
    expect(
      verify(token({
        claims: {
          aud: ["other-client", expectedAudience],
          oid: undefined,
          sub: "fallback-subject",
          email: undefined,
          preferred_username: "preferred@example.test"
        }
      }))
    ).toMatchObject({
      ok: true,
      data: {
        audience: ["other-client", expectedAudience],
        subject: "fallback-subject",
        email: "preferred@example.test"
      }
    });
    expect(
      verify(token({
        claims: {
          email: undefined,
          preferred_username: undefined,
          upn: "upn@example.test"
        }
      }))
    ).toMatchObject({
      ok: true,
      data: { email: "upn@example.test" }
    });
  });

  it("does not expose raw token values in errors", () => {
    const rawToken = token({ signature: "secret-like-token-fragment" });
    const result = verify(rawToken);

    expect(result).toMatchObject({ ok: false });
    expect(JSON.stringify(result)).not.toContain(rawToken);
    expect(JSON.stringify(result)).not.toContain("secret-like-token-fragment");
  });
});
