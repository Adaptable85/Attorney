import { describe, expect, it } from "vitest";

import { createInMemoryOAuthStateStore } from "./oauth-state-store";
import type { OAuthStatePayload } from "./oauth-state";

const now = new Date("2026-06-23T10:00:00.000Z");
const validState: OAuthStatePayload = {
  provider: "microsoft_entra_id",
  state: "state_11111111111111111111111111111111",
  nonce: "nonce_11111111111111111111111111111111",
  redirectTarget: "/admin/dashboard",
  issuedAt: new Date("2026-06-23T09:59:00.000Z"),
  expiresAt: new Date("2026-06-23T10:09:00.000Z")
};

describe("OAuth state store boundary", () => {
  it("stores and consumes valid state once", async () => {
    const store = createInMemoryOAuthStateStore();

    await expect(store.store(validState)).resolves.toMatchObject({ ok: true });
    await expect(store.consume(validState.state, { now })).resolves.toMatchObject({
      ok: true,
      data: {
        state: validState.state,
        nonce: validState.nonce,
        provider: "microsoft_entra_id"
      }
    });
    await expect(store.consume(validState.state, { now })).resolves.toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("fails closed for expired state and removes it", async () => {
    const expiredState = {
      ...validState,
      state: "state_22222222222222222222222222222222",
      expiresAt: new Date("2026-06-23T09:59:59.000Z")
    };
    const store = createInMemoryOAuthStateStore([expiredState]);

    await expect(store.consume(expiredState.state, { now })).resolves.toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
    await expect(store.consume(expiredState.state, { now })).resolves.toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("fails closed for provider mismatch", async () => {
    const store = createInMemoryOAuthStateStore([validState]);

    await expect(
      store.consume(validState.state, {
        expectedProvider: "microsoft_entra_id",
        now
      })
    ).resolves.toMatchObject({ ok: true });
  });

  it("fails closed for missing and malformed state records", async () => {
    const malformed = {
      ...validState,
      state: "short"
    };
    const store = createInMemoryOAuthStateStore();

    await expect(store.consume("missing_state_111111111111111111111111", { now })).resolves.toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    await expect(store.store(malformed)).resolves.toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("expires records without requiring a database", async () => {
    const store = createInMemoryOAuthStateStore([
      validState,
      {
        ...validState,
        state: "state_33333333333333333333333333333333",
        expiresAt: new Date("2026-06-23T09:59:59.000Z")
      }
    ]);

    await expect(store.expire(now)).resolves.toBe(1);
    await expect(store.consume(validState.state, { now })).resolves.toMatchObject({ ok: true });
  });
});

