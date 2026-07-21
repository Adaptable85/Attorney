import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("public website CSS", () => {
  it("keeps premium public sections motion-safe", () => {
    const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

    expect(css).toContain(".premium-hero");
    expect(css).toContain(".pathway-card");
    expect(css).toContain(".founder-feature");
    expect(css).toContain(".trust-band");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".premium-hero__copy");
    expect(css).toContain("animation: none");
  });
});
