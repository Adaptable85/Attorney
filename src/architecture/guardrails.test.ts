import { readFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const sourceRoots = ["AGENTS.md", "CLAUDE.md", ".context", "app", "docs", "src"];
const clientMatterUiFiles = [
  "app/(admin)/admin/clients/new/page.tsx",
  "app/(admin)/admin/matters/new/page.tsx",
  "src/ui/admin/client-create-form.tsx",
  "src/ui/admin/client-list.tsx",
  "src/ui/admin/matter-create-form.tsx",
  "src/ui/admin/matter-detail.tsx",
  "src/ui/admin/matter-list.tsx"
];

function collectTextFiles(path: string): string[] {
  const fullPath = join(root, path);
  const stat = statSync(fullPath);

  if (stat.isFile()) {
    return [fullPath];
  }

  return readdirSync(fullPath).flatMap((entry) => {
    const child = join(path, entry);
    const childFullPath = join(root, child);
    const childStat = statSync(childFullPath);

    if (childStat.isDirectory()) {
      return collectTextFiles(child);
    }

    return childFullPath.endsWith(".ts") ||
      childFullPath.endsWith(".tsx") ||
      childFullPath.endsWith(".md") ||
      childFullPath.endsWith(".css")
      ? [childFullPath]
      : [];
  });
}

function projectSource(): string {
  return sourceRoots
    .flatMap(collectTextFiles)
    .filter((filePath) => !filePath.endsWith("src/architecture/guardrails.test.ts"))
    .map((filePath) => readFileSync(filePath, "utf8"))
    .join("\n");
}

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

  it("does not reference Command Center or command-center artifacts", () => {
    const source = projectSource();

    expect(source).not.toContain("Command Center");
    expect(source).not.toContain("command-center");
    expect(source).not.toContain("artifacts/command-center");
  });

  it("does not add hard-delete service or route naming for protected records", () => {
    const source = projectSource();

    expect(source).not.toMatch(/\bdelete(Client|Matter|Invoice|Statement)\b/);
    expect(source).not.toMatch(/\bhardDelete(Client|Matter|Invoice|Statement)\b/);
  });

  it("keeps client and matter UI free of active send or approval controls", () => {
    const source = [
      readFileSync(join(root, "src/ui/admin/client-list.tsx"), "utf8"),
      readFileSync(join(root, "src/ui/admin/matter-list.tsx"), "utf8"),
      readFileSync(join(root, "src/ui/admin/matter-detail.tsx"), "utf8")
    ].join("\n");

    expect(source).not.toMatch(/<button[^>]*>(?:Approve|Send|Delete|Edit)/);
    expect(source).not.toContain("Approve invoice");
    expect(source).not.toContain("Send statement");
  });

  it("keeps create form submit controls disabled until audited persistence is enabled", () => {
    const clientForm = readFileSync(join(root, "src/ui/admin/client-create-form.tsx"), "utf8");
    const matterForm = readFileSync(join(root, "src/ui/admin/matter-create-form.tsx"), "utf8");

    expect(clientForm).toContain("type=\"button\" disabled");
    expect(matterForm).toContain("type=\"button\" disabled");
    expect(clientForm).not.toContain("action=");
    expect(matterForm).not.toContain("action=");
  });

  it("keeps client and matter UI away from direct Prisma and repository adapters", () => {
    const uiSource = clientMatterUiFiles
      .map((filePath) => readFileSync(join(root, filePath), "utf8"))
      .join("\n");
    const createFormSource = [
      readFileSync(join(root, "src/ui/admin/client-create-form.tsx"), "utf8"),
      readFileSync(join(root, "src/ui/admin/matter-create-form.tsx"), "utf8")
    ].join("\n");

    expect(uiSource).not.toContain("@prisma/client");
    expect(uiSource).not.toContain("@/db/prisma");
    expect(createFormSource).not.toContain("repositories/prisma");
    expect(createFormSource).not.toContain("createPrismaClientsRepository");
    expect(createFormSource).not.toContain("createPrismaMattersRepository");
    expect(createFormSource).not.toContain("transaction-boundary");
    expect(createFormSource).not.toContain("createPrismaTransactionBoundary");
    expect(createFormSource).not.toContain("local-dev-service-composition");
    expect(createFormSource).not.toContain("mutation-gate");
    expect(uiSource).not.toContain("createLocalDevClientMatterServiceComposition");
    expect(uiSource).not.toContain("evaluateMutationGate");
  });

  it("keeps app UI routes free of local/dev composition and active client/matter mutations", () => {
    const appSource = collectTextFiles("app").map((filePath) => readFileSync(filePath, "utf8")).join("\n");

    expect(appSource).not.toContain("local-dev-service-composition");
    expect(appSource).not.toContain("createLocalDevClientMatterServiceComposition");
    expect(appSource).not.toContain("createPrismaClientsRepository");
    expect(appSource).not.toContain("createPrismaMattersRepository");
    expect(appSource).not.toContain("createClientRecord(");
    expect(appSource).not.toContain("createMatterRecord(");
    expect(appSource).not.toContain("evaluateMutationGate");
    expect(appSource).not.toContain("\"use server\"");
  });

  it("keeps mutation release gates default-off", () => {
    const flags = readFileSync(join(root, "src/config/feature-flags.ts"), "utf8");
    const gates = readFileSync(join(root, "src/config/release-gates.ts"), "utf8");

    expect(flags).toContain('const enabledValue = "true"');
    expect(flags).toContain("return value === enabledValue");
    expect(gates).toContain("client_matter_writes_disabled");
    expect(gates).toContain("production_auth_missing");
    expect(gates).toContain("local_dev_writes_disabled");
  });

  it("keeps normal tests database-free and DB tests locally guarded", () => {
    const testFiles = collectTextFiles("src").filter((filePath) => filePath.endsWith(".test.ts"));
    const dbTestFiles = testFiles.filter((filePath) => filePath.endsWith(".db.test.ts"));
    const normalTestSource = testFiles
      .filter((filePath) => !filePath.endsWith(".db.test.ts"))
      .filter((filePath) => !filePath.endsWith("src/db/prisma.test.ts"))
      .filter((filePath) => !filePath.endsWith("src/architecture/guardrails.test.ts"))
      .map((filePath) => readFileSync(filePath, "utf8"))
      .join("\n");

    expect(normalTestSource).not.toContain("process.env.DATABASE_URL");
    expect(normalTestSource).not.toContain("getPrismaClient()");

    for (const filePath of dbTestFiles) {
      const source = readFileSync(filePath, "utf8");

      expect(source).toContain("requireSafeLocalDatabaseUrl");
    }
  });

  it("requires mutation-capable services to use audited service context", () => {
    const clientsService = readFileSync(join(root, "src/services/clients-service.ts"), "utf8");
    const mattersService = readFileSync(join(root, "src/services/matters-service.ts"), "utf8");

    expect(clientsService).toContain("context: ServiceContext");
    expect(clientsService).toContain("executeAuditedMutation");
    expect(clientsService).toContain("transactionBoundary?: TransactionBoundary");
    expect(clientsService).toContain("transaction: dependencies.transactionBoundary");
    expect(clientsService).toContain("eventType: \"client_created\"");
    expect(mattersService).toContain("context: ServiceContext");
    expect(mattersService).toContain("executeAuditedMutation");
    expect(mattersService).toContain("transactionBoundary?: TransactionBoundary");
    expect(mattersService).toContain("transaction: dependencies.transactionBoundary");
    expect(mattersService).toContain("eventType: \"matter_created\"");
  });
});
