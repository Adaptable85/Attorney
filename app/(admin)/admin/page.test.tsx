import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import AdminPage from "./page";

describe("admin page route", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders non-empty admin shell content for the local placeholder admin", async () => {
    vi.stubEnv("NODE_ENV", "test");

    const html = renderToStaticMarkup(await AdminPage());

    expect(html).toContain("Burgess Attorneys Admin");
    expect(html).toContain("Access Boundary");
    expect(html).toContain("Not implemented yet");
    expect(html.length).toBeGreaterThan(1000);
  });
});
