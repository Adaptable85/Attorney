import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PublicShell } from "./public-shell";

describe("public shell", () => {
  it("does not expose an admin route from public header or footer navigation", () => {
    const html = renderToStaticMarkup(
      <PublicShell>
        <main>Public content</main>
      </PublicShell>
    );

    expect(html).not.toContain("href=\"/admin\"");
    expect(html).not.toContain("href=\"/admin/");
    expect(html).not.toContain("/admin/sign-in");
  });
});
