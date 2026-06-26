import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import AdminPage from "./page";

describe("admin page route", () => {
  afterEach(() => {
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
});
