import { describe, expect, it, vi } from "vitest";

import { buildEntraJwksDescriptor } from "./entra-jwks";

const tenantId = "11111111-1111-4111-8111-111111111111";

describe("Microsoft Entra JWKS descriptor", () => {
  it("builds JWKS URL without fetching keys", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = buildEntraJwksDescriptor(tenantId);

    expect(result).toEqual({
      ok: true,
      data: {
        issuerUrl: `https://login.microsoftonline.com/${tenantId}/v2.0`,
        jwksUrl: `https://login.microsoftonline.com/${tenantId}/v2.0/discovery/v2.0/keys`
      }
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("fails closed for invalid tenants", () => {
    expect(buildEntraJwksDescriptor("not a tenant")).toMatchObject({
      ok: false,
      error: { code: "VALIDATION_ERROR" }
    });
  });
});

