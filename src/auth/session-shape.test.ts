import { describe, expect, it } from "vitest";

import { validateFutureAuthSessionShape } from "./session-shape";

const now = new Date("2026-06-23T10:00:00.000Z");
const validSession = {
  userId: "entra-user-1",
  email: "owner@example.test",
  displayName: "Owner User",
  roleKey: "OWNER_PRINCIPAL",
  provider: "microsoft_entra_id",
  issuedAt: new Date("2026-06-23T09:00:00.000Z"),
  expiresAt: new Date("2026-06-23T11:00:00.000Z")
} as const;

describe("future auth session shape", () => {
  it("validates the future production session shape without creating cookies", () => {
    const result = validateFutureAuthSessionShape(validSession, now);

    expect(result).toMatchObject({
      ok: true,
      data: {
        userId: "entra-user-1",
        email: "owner@example.test",
        roleKey: "OWNER_PRINCIPAL",
        provider: "microsoft_entra_id"
      }
    });
  });

  it("fails closed for missing identity fields", () => {
    expect(validateFutureAuthSessionShape({ ...validSession, userId: "" }, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(validateFutureAuthSessionShape({ ...validSession, email: "" }, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("fails closed for unknown role and provider", () => {
    expect(validateFutureAuthSessionShape({ ...validSession, roleKey: "SUPER_ADMIN" }, now)).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
    expect(validateFutureAuthSessionShape({ ...validSession, provider: "local_dev_placeholder" }, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("fails closed for missing or expired timestamps", () => {
    expect(validateFutureAuthSessionShape({ ...validSession, expiresAt: null }, now)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(
      validateFutureAuthSessionShape(
        {
          ...validSession,
          expiresAt: new Date("2026-06-23T09:30:00.000Z")
        },
        now
      )
    ).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
  });
});

