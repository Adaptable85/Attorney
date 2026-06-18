import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("migration and seed guardrails", () => {
  it("documents that agents must not run production migrations", () => {
    const strategy = readFileSync(
      join(root, "docs/architecture/database-migration-strategy.md"),
      "utf8"
    );

    expect(strategy).toContain("Production migrations must not be run automatically by agents");
    expect(strategy).toContain("Seed data must not contain real client data");
  });

  it("keeps seed script dev-only and guarded", () => {
    const seed = readFileSync(join(root, "prisma/seed.ts"), "utf8");

    expect(seed).toContain("BURGESS_ALLOW_DEV_SEED");
    expect(seed).toContain("production");
    expect(seed).toContain("Dev seed skipped");
    expect(seed).toContain("Actual database writes are deferred");
  });

  it("keeps seed fixtures free of real Burgess client names", () => {
    const fixtures = [
      "src/test/fixtures/users.ts",
      "src/test/fixtures/clients.ts",
      "src/test/fixtures/matters.ts",
      "src/test/fixtures/financial.ts"
    ]
      .map((file) => readFileSync(join(root, file), "utf8"))
      .join("\n")
      .toLowerCase();

    expect(fixtures).not.toContain("burgess");
    expect(fixtures).not.toContain("attorneys inc");
  });
});

