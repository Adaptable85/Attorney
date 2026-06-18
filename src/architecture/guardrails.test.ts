import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("architecture guardrails", () => {
  const criticalRules = [
    "Owner/principal attorney approval is mandatory",
    "OpenClaw/AI agents may draft",
    "Lexpro remains source of truth",
    "Invoice numbers are assigned only on owner/principal approval"
  ];

  it.each([
    "AGENTS.md",
    "CLAUDE.md",
    ".context/rules/operating-constraints.md"
  ])("keeps critical rules visible in %s", (filePath) => {
    const file = readFileSync(join(root, filePath), "utf8");

    for (const rule of criticalRules) {
      expect(file).toContain(rule);
    }
  });
});
