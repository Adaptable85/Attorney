import { describe, expect, it } from "vitest";

import {
  canApproveInvoices,
  canApproveStatements,
  canCreateClients
} from "@/domain/permission-policy";
import type { ProductionAuthReadiness } from "../auth-readiness";
import type { EntraAuthConfig } from "./entra-config";
import { mapEntraClaimsToPrincipal } from "./entra-claims";

const readiness: ProductionAuthReadiness = {
  ready: true,
  provider: "microsoft_entra_id"
};

const config: EntraAuthConfig = {
  provider: "microsoft_entra_id",
  tenantId: "11111111-1111-4111-8111-111111111111",
  clientId: "22222222-2222-4222-8222-222222222222",
  clientSecretConfigured: true,
  issuerUrl: "https://login.microsoftonline.com/11111111-1111-4111-8111-111111111111/v2.0",
  openIdConfigurationUrl:
    "https://login.microsoftonline.com/11111111-1111-4111-8111-111111111111/v2.0/.well-known/openid-configuration",
  redirectUri: "https://admin.example.test/api/auth/entra/callback",
  allowedEmailDomains: ["example.test"],
  roleClaimName: "roles"
};

const baseClaims = {
  oid: "entra-user-1",
  email: "owner@example.test",
  name: "Owner User",
  tid: config.tenantId,
  roles: ["OWNER_PRINCIPAL"]
};

describe("Microsoft Entra claim mapping", () => {
  it("maps owner role claims correctly", () => {
    const result = mapEntraClaimsToPrincipal(baseClaims, config, readiness);

    expect(result).toMatchObject({ ok: true });
    expect(result.ok && result.data.roles).toEqual(["OWNER_PRINCIPAL"]);
    expect(result.ok && canApproveInvoices(result.data.roles[0])).toBe(true);
    expect(result.ok && result.data.providerSource).toBe("microsoft_entra_id");
  });

  it("maps support role claims without invoice or statement approval powers", () => {
    const result = mapEntraClaimsToPrincipal(
      { ...baseClaims, email: "support@example.test", roles: ["SUPPORT_ADMIN"] },
      config,
      readiness
    );

    expect(result).toMatchObject({ ok: true });
    expect(result.ok && result.data.roles).toEqual(["SUPPORT_ADMIN"]);
    expect(result.ok && canApproveInvoices(result.data.roles[0])).toBe(false);
    expect(result.ok && canApproveStatements(result.data.roles[0])).toBe(false);
  });

  it("maps agent role claims but keeps client writes blocked by policy", () => {
    const result = mapEntraClaimsToPrincipal(
      { ...baseClaims, email: "agent@example.test", roles: ["AGENT_SERVICE"] },
      config,
      readiness
    );

    expect(result).toMatchObject({ ok: true });
    expect(result.ok && result.data.roles).toEqual(["AGENT_SERVICE"]);
    expect(result.ok && canCreateClients(result.data.roles[0])).toBe(false);
  });

  it("maps read-only reviewer role claims", () => {
    const result = mapEntraClaimsToPrincipal(
      { ...baseClaims, email: "reviewer@example.test", roles: ["READ_ONLY_REVIEWER"] },
      config,
      readiness
    );

    expect(result).toMatchObject({ ok: true });
    expect(result.ok && result.data.roles).toEqual(["READ_ONLY_REVIEWER"]);
  });

  it("supports alternate subject, email and string role claim shapes", () => {
    const result = mapEntraClaimsToPrincipal(
      {
        sub: "entra-subject-1",
        preferred_username: "alternate@example.test",
        roles: "SUPPORT_ADMIN"
      },
      config,
      readiness
    );

    expect(result).toMatchObject({ ok: true });
    expect(result.ok && result.data.userId).toBe("entra-subject-1");
    expect(result.ok && result.data.email).toBe("alternate@example.test");
    expect(result.ok && result.data.displayName).toBeUndefined();
  });

  it("fails closed when required identity claims are missing", () => {
    expect(mapEntraClaimsToPrincipal({ ...baseClaims, email: undefined }, config, readiness)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(mapEntraClaimsToPrincipal({ ...baseClaims, oid: undefined }, config, readiness)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
  });

  it("fails closed for missing role and disallowed email domain", () => {
    expect(mapEntraClaimsToPrincipal({ ...baseClaims, roles: [] }, config, readiness)).toMatchObject({
      ok: false,
      error: { code: "SERVICE_CONTEXT_ERROR" }
    });
    expect(
      mapEntraClaimsToPrincipal({ ...baseClaims, email: "owner@other.example" }, config, readiness)
    ).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
  });

  it("fails closed for unknown role and wrong tenant", () => {
    expect(
      mapEntraClaimsToPrincipal({ ...baseClaims, roles: ["SUPER_ADMIN"] }, config, readiness)
    ).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
    expect(
      mapEntraClaimsToPrincipal({ ...baseClaims, tid: "33333333-3333-4333-8333-333333333333" }, config, readiness)
    ).toMatchObject({
      ok: false,
      error: { code: "UNAUTHORIZED" }
    });
  });

  it("does not expose raw claims to the mapped principal", () => {
    const result = mapEntraClaimsToPrincipal(
      { ...baseClaims, raw_token: "raw-token-must-not-leak" },
      config,
      readiness
    );

    expect(result).toMatchObject({ ok: true });
    expect(JSON.stringify(result)).not.toContain("raw-token-must-not-leak");
    expect(JSON.stringify(result)).not.toContain("raw_token");
  });
});
