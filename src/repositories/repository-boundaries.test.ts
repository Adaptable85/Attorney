import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const repositoriesDir = join(root, "src/repositories");

function collectRepositoryFiles(path: string): string[] {
  return readdirSync(path).flatMap((entry) => {
    const fullPath = join(path, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      return collectRepositoryFiles(fullPath);
    }

    return fullPath.endsWith(".ts") ? [fullPath] : [];
  });
}

function repositorySource(): string {
  return collectRepositoryFiles(repositoriesDir)
    .filter((file) => !file.endsWith("repository-boundaries.test.ts"))
    .filter((file) => !file.endsWith(".test.ts"))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
}

describe("repository boundaries", () => {
  it("does not expose hard-delete methods for protected records", () => {
    const source = repositorySource();

    expect(source).not.toMatch(/\bdelete(Client|Matter|Invoice|Statement|Document|Financial)/);
    expect(source).not.toMatch(/\bhardDelete/);
    expect(source).not.toMatch(/\bremove(Client|Matter|Invoice|Statement|Document)/);
  });

  it("keeps approved invoice and statement changes behind correction workflows", () => {
    const invoices = readFileSync(join(repositoriesDir, "invoices-repository.ts"), "utf8");
    const statements = readFileSync(join(repositoriesDir, "statements-repository.ts"), "utf8");

    expect(invoices).toContain("updateDraftOnly");
    expect(invoices).toContain("markCorrectedByCorrectionRecord");
    expect(invoices).not.toContain("updateApproved");

    expect(statements).toContain("markCorrectedByCorrectionRecord");
    expect(statements).not.toContain("updateApproved");
  });

  it("requires target and reason in financial correction repository inputs", () => {
    const source = readFileSync(
      join(root, "src/domain/financial-corrections.ts"),
      "utf8"
    );

    expect(source).toContain("targetRecordType");
    expect(source).toContain("targetRecordId");
    expect(source).toContain("reason");
  });
});
