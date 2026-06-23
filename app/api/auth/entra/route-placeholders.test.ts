import { describe, expect, it } from "vitest";

import { GET as callbackGet } from "./callback/route";
import { GET as loginGet } from "./login/route";
import { POST as logoutPost } from "./logout/route";

async function json(response: Response): Promise<Record<string, unknown>> {
  return await response.json() as Record<string, unknown>;
}

describe("Microsoft Entra route placeholders", () => {
  it("keeps login disabled without redirecting to Microsoft", async () => {
    const response = loginGet();

    expect(response.status).toBe(503);
    expect(response.headers.get("Location")).toBeNull();
    expect(response.headers.get("Set-Cookie")).toBeNull();
    await expect(json(response)).resolves.toMatchObject({
      ok: false,
      code: "entra_auth_not_enabled",
      route: "login"
    });
  });

  it("keeps callback disabled without creating a session", async () => {
    const response = callbackGet(
      new Request("https://admin.example.test/api/auth/entra/callback?code=placeholder&state=placeholder")
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("Set-Cookie")).toBeNull();
    await expect(json(response)).resolves.toMatchObject({
      ok: false,
      code: "entra_auth_not_enabled",
      route: "callback"
    });
  });

  it("keeps logout disabled without mutating cookies", async () => {
    const response = logoutPost();

    expect(response.status).toBe(503);
    expect(response.headers.get("Set-Cookie")).toBeNull();
    await expect(json(response)).resolves.toMatchObject({
      ok: false,
      code: "entra_auth_not_enabled",
      route: "logout"
    });
  });
});

