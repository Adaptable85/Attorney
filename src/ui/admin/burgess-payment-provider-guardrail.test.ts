import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const blockedProviderA = ["Yo", "co"].join("");
const blockedProviderB = ["Pay", "fast"].join("");
const filesToCheck = [
  "app/page.tsx",
  "app/(admin)/admin/page.tsx",
  "src/ui/admin/admin-shell.tsx",
  "src/ui/admin/admin-section-review-data.ts",
  "src/ui/admin/client-list.tsx",
  "src/ui/admin/matter-list.tsx"
];

describe("Burgess payment-provider guardrail", () => {
  it("keeps provider and commerce copy out of public and admin review code", () => {
    const combinedSource = filesToCheck
      .map((file) => readFileSync(join(repoRoot, file), "utf8"))
      .join("\n");

    expect(combinedSource).not.toContain(blockedProviderA);
    expect(combinedSource).not.toContain(blockedProviderB);
    expect(combinedSource).not.toMatch(/payment\s+gateway/i);
    expect(combinedSource).not.toMatch(/check\s*out/i);
    expect(combinedSource).not.toMatch(/sh[o]p/i);
  });
});
