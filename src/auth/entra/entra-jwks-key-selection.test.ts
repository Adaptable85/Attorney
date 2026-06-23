import { describe, expect, it } from "vitest";

import { selectEntraJwksKey, type EntraJwksPublicKey } from "./entra-jwks-key-selection";

const fakeKeys: readonly EntraJwksPublicKey[] = [
  { kid: "fake-key-1", kty: "RSA", alg: "RS256", use: "sig" },
  { kid: "fake-key-2", kty: "RSA", alg: "RS256", use: "sig" }
];

describe("Microsoft Entra JWKS key selection", () => {
  it("selects a matching fake key by kid and allowed algorithm", () => {
    expect(selectEntraJwksKey({ keys: fakeKeys, kid: "fake-key-1", algorithm: "RS256" })).toEqual({
      ok: true,
      data: { kid: "fake-key-1", kty: "RSA", alg: "RS256", use: "sig" }
    });
  });

  it("rejects missing and unknown kid values", () => {
    expect(selectEntraJwksKey({ keys: fakeKeys, kid: null, algorithm: "RS256" })).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(selectEntraJwksKey({ keys: fakeKeys, kid: "missing", algorithm: "RS256" })).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects duplicate kid values", () => {
    expect(
      selectEntraJwksKey({
        keys: [
          { kid: "duplicate", kty: "RSA", alg: "RS256" },
          { kid: "duplicate", kty: "RSA", alg: "RS256" }
        ],
        kid: "duplicate",
        algorithm: "RS256"
      })
    ).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects unsupported algorithms, key types and key use", () => {
    expect(selectEntraJwksKey({ keys: fakeKeys, kid: "fake-key-1", algorithm: "HS256" })).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(
      selectEntraJwksKey({
        keys: [{ kid: "ec-key", kty: "EC", alg: "RS256", use: "sig" }],
        kid: "ec-key",
        algorithm: "RS256"
      })
    ).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(
      selectEntraJwksKey({
        keys: [{ kid: "enc-key", kty: "RSA", alg: "RS256", use: "enc" }],
        kid: "enc-key",
        algorithm: "RS256"
      })
    ).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(
      selectEntraJwksKey({
        keys: [{ kid: "mismatch-key", kty: "RSA", alg: "RS384", use: "sig" }],
        kid: "mismatch-key",
        algorithm: "RS256"
      })
    ).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });
});
