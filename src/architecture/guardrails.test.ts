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

  it("keeps document metadata private and free of raw content fields", () => {
    const schema = readFileSync(join(root, "prisma/schema.prisma"), "utf8");
    const documentModel = schema.split("model DocumentRecord")[1]?.split("model TimelineEvent")[0];

    expect(documentModel).toContain("visibility  DocumentVisibility @default(PRIVATE)");
    expect(documentModel).not.toContain("rawContent");
    expect(documentModel).not.toContain("fileContent");
    expect(documentModel).not.toContain("bytes");
  });

  it("keeps financial money fields integer-cents based", () => {
    const schema = readFileSync(join(root, "prisma/schema.prisma"), "utf8");
    const financialSection = schema.split("model BillingLineItem")[1];

    expect(financialSection).toContain("totalAmountCents  Int");
    expect(financialSection).toContain("subtotalCents");
    expect(financialSection).toContain("closingBalanceCents");
    expect(financialSection).not.toContain("amount Float");
    expect(financialSection).not.toContain("total Float");
    expect(financialSection).not.toContain("balance Float");
  });

  it("keeps financial correction and Lexpro boundary rules visible", () => {
    const files = [
      readFileSync(join(root, "AGENTS.md"), "utf8"),
      readFileSync(join(root, "CLAUDE.md"), "utf8"),
      readFileSync(join(root, ".context/rules/operating-constraints.md"), "utf8")
    ];

    for (const file of files) {
      expect(file).toContain("Invoice numbers are assigned only on owner/principal approval");
      expect(file).toContain("Approved financial records require correction records");
      expect(file).toContain("Lexpro remains source of truth");
    }
  });
});
