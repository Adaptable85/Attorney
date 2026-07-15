import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const blockedProviderA = ["Yo", "co"].join("");
const blockedProviderB = ["Pay", "fast"].join("");
const filesToCheck = [
  "app/page.tsx",
  "app/(admin)/admin/page.tsx",
  "app/(admin)/admin/clients/page.tsx",
  "app/(admin)/admin/clients/[slug]/page.tsx",
  "app/(admin)/admin/clients/new/page.tsx",
  "app/(admin)/admin/clients/create/route.ts",
  "app/(admin)/admin/documents/page.tsx",
  "app/(admin)/admin/documents/[slug]/page.tsx",
  "app/(admin)/admin/billing/page.tsx",
  "app/(admin)/admin/billing/[slug]/page.tsx",
  "app/(admin)/admin/invoice-items/page.tsx",
  "app/(admin)/admin/lexpro/page.tsx",
  "app/(admin)/admin/lexpro/[slug]/page.tsx",
  "app/(admin)/admin/audit/page.tsx",
  "app/(admin)/admin/audit/[slug]/page.tsx",
  "app/(admin)/admin/access/page.tsx",
  "app/(admin)/admin/matters/page.tsx",
  "app/(admin)/admin/matters/[id]/page.tsx",
  "src/ui/admin/admin-shell.tsx",
  "src/ui/admin/admin-section-review-data.ts",
  "src/ui/admin/back-office-review.tsx",
  "src/ui/admin/back-office-review-data.ts",
  "src/ui/admin/client-detail-preview.tsx",
  "src/ui/admin/client-list.tsx",
  "src/ui/admin/client-create-form.tsx",
  "src/ui/admin/clients-review-data.ts",
  "src/ui/admin/live-client-file-detail.tsx",
  "src/ui/admin/invoice-items-review.tsx",
  "src/ui/admin/invoice-items-review-data.ts",
  "src/ui/admin/document-detail-preview.tsx",
  "src/ui/admin/document-list.tsx",
  "src/ui/admin/documents-review-data.ts",
  "src/ui/admin/matter-detail.tsx",
  "src/ui/admin/matter-list.tsx",
  "src/ui/admin/matters-review-data.ts"
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
    expect(combinedSource).not.toContain(["member", "ship"].join(""));
  });
});
