import { describe, expect, it } from "vitest";

import { createPkceChallenge, generatePkceVerifier, validatePkceVerifier } from "./pkce";

const verifier = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";

describe("PKCE helpers", () => {
  it("generates a verifier shape", () => {
    const generated = generatePkceVerifier();

    expect(validatePkceVerifier(generated)).toMatchObject({ ok: true });
    expect(generated.length).toBeGreaterThanOrEqual(43);
    expect(generated.length).toBeLessThanOrEqual(128);
  });

  it("creates an S256 challenge from a verifier", () => {
    expect(createPkceChallenge(verifier)).toEqual({
      ok: true,
      data: {
        method: "S256",
        challenge: "ImpiCd8pp4MveCNnbIS7-GXEtB0xF5HMIDoWqvGA5ig"
      }
    });
  });

  it("rejects invalid verifiers", () => {
    expect(validatePkceVerifier("too-short")).toMatchObject({
      ok: false,
      error: { code: "VALIDATION_ERROR" }
    });
    expect(createPkceChallenge("contains space and is invalid despite being long enough 123456789")).toMatchObject({
      ok: false,
      error: { code: "VALIDATION_ERROR" }
    });
  });

  it("does not expose secret-like values in errors", () => {
    const secretLikeVerifier = "secret secret secret secret secret secret secret secret";
    const result = createPkceChallenge(secretLikeVerifier);

    expect(result).toMatchObject({ ok: false });
    expect(JSON.stringify(result)).not.toContain(secretLikeVerifier);
  });
});
