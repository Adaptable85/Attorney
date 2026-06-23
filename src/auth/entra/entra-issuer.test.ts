import { describe, expect, it, vi } from "vitest";

import { buildEntraIssuer, isValidEntraTenantId } from "./entra-issuer";

const tenantId = "11111111-1111-4111-8111-111111111111";

describe("Microsoft Entra issuer helpers", () => {
  it("builds issuer and metadata URLs for a valid placeholder tenant", () => {
    const result = buildEntraIssuer(tenantId);

    expect(result).toMatchObject({ ok: true });
    expect(result.ok && result.data.issuerUrl).toBe(
      `https://login.microsoftonline.com/${tenantId}/v2.0`
    );
    expect(result.ok && result.data.openIdConfigurationUrl).toBe(
      `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`
    );
  });

  it("fails closed for invalid tenant IDs", () => {
    expect(isValidEntraTenantId("not a tenant")).toBe(false);
    expect(buildEntraIssuer("not a tenant")).toMatchObject({
      ok: false,
      error: { code: "VALIDATION_ERROR" }
    });
  });

  it("does not perform network discovery in normal tests", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    buildEntraIssuer(tenantId);

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

