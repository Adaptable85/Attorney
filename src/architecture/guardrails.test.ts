import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("architecture guardrails", () => {
  it("keeps critical approval and Lexpro rules visible in AGENTS.md", () => {
    const agents = readFileSync(join(root, "AGENTS.md"), "utf8");

    expect(agents).toContain("Owner/principal attorney approval is mandatory");
    expect(agents).toContain("OpenClaw/AI agents may draft");
    expect(agents).toContain("Lexpro remains source of truth");
    expect(agents).toContain("No secrets in Git");
  });
});

