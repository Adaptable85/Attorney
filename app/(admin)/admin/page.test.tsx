import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  adminPasswordSessionCookieName,
  createAdminPasswordSessionCookieValue,
  getAdminPasswordAccessConfig
} from "@/auth/admin-password-access";
import AdminPage from "./page";

const cookieStore = vi.hoisted(() => ({
  value: undefined as string | undefined
}));

vi.mock("next/headers", () => ({
  async cookies() {
    return {
      get(name: string) {
        return name === adminPasswordSessionCookieName && cookieStore.value
          ? { value: cookieStore.value }
          : undefined;
      }
    };
  }
}));

describe("admin page route", () => {
  afterEach(() => {
    cookieStore.value = undefined;
    vi.unstubAllEnvs();
  });

  it("does not expose admin shell content when password access is disabled", async () => {
    vi.stubEnv("NODE_ENV", "test");

    const html = renderToStaticMarkup(await AdminPage());

    expect(html).toContain("Staging Admin Access");
    expect(html).toContain("Burgess Attorneys Admin");
    expect(html).toContain("Staging password access is disabled.");
    expect(html).not.toContain("Access Boundary");
    expect(html).not.toContain("Not implemented yet");
    expect(html).not.toContain("Protected internal shell");
    expect(html.length).toBeGreaterThan(600);
  });

  it("renders the admin shell for a signed staging password session", async () => {
    vi.stubEnv("BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED", "true");
    vi.stubEnv("BURGESS_ADMIN_PASSWORD", "correct-password");
    vi.stubEnv("BURGESS_ADMIN_SESSION_SECRET", "session-secret");
    cookieStore.value = createAdminPasswordSessionCookieValue(
      getAdminPasswordAccessConfig({
        BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED: "true",
        BURGESS_ADMIN_PASSWORD: "correct-password",
        BURGESS_ADMIN_SESSION_SECRET: "session-secret"
      })
    ) ?? undefined;

    const html = renderToStaticMarkup(await AdminPage());

    expect(html).toContain("Burgess Attorneys Admin");
    expect(html).toContain("Read-Only Reviewer");
    expect(html).toContain("Admin client file workspace");
    expect(html).toContain("Client Files");
    expect(html).not.toContain("Enter the staging admin password");
  });
});
