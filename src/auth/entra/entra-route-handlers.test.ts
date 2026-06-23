import { describe, expect, it, vi } from "vitest";

import {
  buildDisabledEntraAuthPayload,
  buildDisabledEntraAuthResponse,
  buildDisabledEntraCallbackResponse,
  validateDisabledCallbackInput
} from "./entra-route-handlers";

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  return await response.json() as Record<string, unknown>;
}

describe("Microsoft Entra disabled route handlers", () => {
  it("builds safe disabled payloads for login, callback and logout", () => {
    for (const route of ["login", "callback", "logout"] as const) {
      expect(buildDisabledEntraAuthPayload(route)).toEqual({
        ok: false,
        code: "entra_auth_not_enabled",
        route,
        message: `Microsoft Entra ${route} is not configured or enabled yet.`
      });
    }
  });

  it("returns no-store 503 JSON without cookies or redirects", async () => {
    const response = buildDisabledEntraAuthResponse("login");

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Set-Cookie")).toBeNull();
    expect(response.headers.get("Location")).toBeNull();
    await expect(responseJson(response)).resolves.toMatchObject({
      ok: false,
      code: "entra_auth_not_enabled",
      route: "login"
    });
  });

  it("models callback code/state as disabled and fail-closed", async () => {
    const missing = validateDisabledCallbackInput(
      new URL("https://admin.example.test/api/auth/entra/callback")
    );
    const present = validateDisabledCallbackInput(
      new URL("https://admin.example.test/api/auth/entra/callback?code=placeholder&state=placeholder")
    );

    expect(missing).toMatchObject({
      code: "entra_auth_not_enabled",
      message: expect.stringContaining("requires reviewed code/state handling")
    });
    expect(present).toMatchObject({ code: "entra_auth_not_enabled", route: "callback" });

    const response = buildDisabledEntraCallbackResponse(
      "https://admin.example.test/api/auth/entra/callback?code=placeholder&state=placeholder"
    );

    await expect(responseJson(response)).resolves.toMatchObject({
      ok: false,
      code: "entra_auth_not_enabled",
      route: "callback"
    });
  });

  it("does not perform network calls", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    buildDisabledEntraAuthResponse("logout");

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

