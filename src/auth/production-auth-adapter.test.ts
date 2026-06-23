import { describe, expect, it } from "vitest";

import { canRolePerform } from "@/domain/permission-policy";
import {
  createProductionAuthAdapter,
  mapProductionAuthClaimsToPrincipal,
  type ProductionAuthClaims
} from "./production-auth-adapter";
import type { ProductionAuthReadiness } from "./auth-readiness";

const ready: ProductionAuthReadiness = {
  ready: true,
  provider: "microsoft_entra_id"
};

const baseClaims: ProductionAuthClaims = {
  subject: "provider-user-1",
  email: "owner@example.test",
  displayName: "Owner User",
  roleClaims: ["OWNER_PRINCIPAL"],
  provider: "microsoft_entra_id",
  issuedAt: new Date("2026-06-23T06:00:00.000Z"),
  expiresAt: new Date("2026-06-23T14:00:00.000Z")
};

describe("production auth adapter boundary", () => {
  it("fails closed for missing required identity claims", () => {
    expect(mapProductionAuthClaimsToPrincipal({ ...baseClaims, subject: "" }, ready)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(mapProductionAuthClaimsToPrincipal({ ...baseClaims, email: "" }, ready)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("fails closed for missing or unknown role claims", () => {
    expect(mapProductionAuthClaimsToPrincipal({ ...baseClaims, roleClaims: [] }, ready)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(
      mapProductionAuthClaimsToPrincipal({ ...baseClaims, roleClaims: ["SUPER_ADMIN"] }, ready)
    ).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
  });

  it("maps owner, support and reviewer roles through explicit internal keys", () => {
    for (const role of ["OWNER_PRINCIPAL", "SUPPORT_ADMIN", "READ_ONLY_REVIEWER"] as const) {
      const result = mapProductionAuthClaimsToPrincipal({ ...baseClaims, roleClaims: [role] }, ready);

      expect(result).toMatchObject({ ok: true });
      expect(result.ok && result.data.roles).toEqual([role]);
      expect(result.ok && result.data.provider).toBe("future_provider_backed");
    }
  });

  it("maps agent users but does not grant admin write permissions", () => {
    const result = mapProductionAuthClaimsToPrincipal(
      { ...baseClaims, roleClaims: ["AGENT_SERVICE"] },
      ready
    );

    expect(result).toMatchObject({ ok: true });
    expect(result.ok && canRolePerform(result.data.roles[0], "create_client")).toBe(false);
    expect(result.ok && canRolePerform(result.data.roles[0], "create_matter")).toBe(false);
  });

  it("fails closed when production auth is not ready", () => {
    expect(
      mapProductionAuthClaimsToPrincipal(baseClaims, {
        ready: false,
        reason: "explicit_enablement_missing"
      })
    ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
  });

  it("does not expose raw provider payload to consumers", async () => {
    const adapter = createProductionAuthAdapter({
      provider: "microsoft_entra_id",
      readiness: ready,
      async loadClaims() {
        return {
          ...baseClaims,
          extraRawPayload: "must-not-leak"
        } as ProductionAuthClaims & { extraRawPayload: string };
      }
    });

    const result = await adapter.getCurrentPrincipal();

    expect(result).toMatchObject({ ok: true });
    expect(JSON.stringify(result)).not.toContain("extraRawPayload");
    expect(JSON.stringify(result)).not.toContain("must-not-leak");
  });
});
