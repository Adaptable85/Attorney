import { describe, expect, it } from "vitest";

import { createOAuthStatePayload, validateOAuthStatePayload } from "./oauth-state";

const now = new Date("2026-06-23T10:00:00.000Z");
const validState = {
  provider: "microsoft_entra_id",
  state: "state_11111111111111111111111111111111",
  nonce: "nonce_11111111111111111111111111111111",
  redirectTarget: "/admin/dashboard",
  issuedAt: new Date("2026-06-23T09:59:00.000Z"),
  expiresAt: new Date("2026-06-23T10:09:00.000Z")
} as const;

describe("OAuth state and nonce helpers", () => {
  it("creates a valid state payload shape without secrets or cookies", () => {
    const result = createOAuthStatePayload({
      now,
      redirectTarget: "/admin/dashboard",
      state: validState.state,
      nonce: validState.nonce
    });

    expect(result).toMatchObject({
      ok: true,
      data: {
        provider: "microsoft_entra_id",
        redirectTarget: "/admin/dashboard",
        state: validState.state,
        nonce: validState.nonce
      }
    });
    expect(JSON.stringify(result)).not.toContain("secret");
  });

  it("accepts valid state", () => {
    expect(validateOAuthStatePayload(validState, { now })).toMatchObject({
      ok: true,
      data: {
        provider: "microsoft_entra_id",
        redirectTarget: "/admin/dashboard"
      }
    });
  });

  it("rejects expired state", () => {
    expect(
      validateOAuthStatePayload(
        {
          ...validState,
          expiresAt: new Date("2026-06-23T09:59:30.000Z")
        },
        { now }
      )
    ).toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
  });

  it("rejects malformed state and missing fields", () => {
    expect(validateOAuthStatePayload({ ...validState, state: "short" }, { now })).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(validateOAuthStatePayload({ ...validState, nonce: null }, { now })).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(validateOAuthStatePayload({ ...validState, issuedAt: null }, { now })).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("rejects wrong provider", () => {
    expect(validateOAuthStatePayload({ ...validState, provider: "auth0" }, { now })).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
  });

  it("rejects unsafe redirect targets", () => {
    expect(createOAuthStatePayload({ redirectTarget: "https://evil.example.test" })).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
    expect(validateOAuthStatePayload({ ...validState, redirectTarget: "/api/auth/entra/login" }, { now })).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
  });
});

