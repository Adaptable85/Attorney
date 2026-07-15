import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { StagingMatterList } from "./staging-matter-list";

const matter = {
  id: "matter_1",
  clientId: "client_1",
  clientDisplayName: "TEST Client File - Delete Later",
  accountNumber: "TEST-MATTER-001",
  name: "TEST Matter - Delete Later",
  description: "Staging test matter",
  type: "OTHER" as const,
  status: "OPEN" as const,
  nextStepDueDate: null,
  updatedAt: new Date("2026-07-15T09:00:00.000Z")
};

describe("staging matter list", () => {
  it("renders searchable staging matters", () => {
    const html = renderToStaticMarkup(
      <StagingMatterList
        matters={[matter]}
        query="TEST"
        databaseAvailable={true}
      />
    );

    expect(html).toContain("Practice matters");
    expect(html).toContain("Search matters");
    expect(html).toContain("Matter filters");
    expect(html).toContain("Unbilled draft fees");
    expect(html).toContain("Draft invoices");
    expect(html).toContain("TEST Matter - Delete Later");
    expect(html).toContain("/admin/matters/matter_1");
    expect(html).toContain("/admin/matters/matter_1#documents");
    expect(html).toContain("/admin/matters/matter_1#billing");
    expect(html).not.toContain("Approve invoice");
    expect(html).not.toContain("Send statement");
  });

  it("renders database unavailable state", () => {
    const html = renderToStaticMarkup(
      <StagingMatterList
        matters={[]}
        query=""
        databaseAvailable={false}
      />
    );

    expect(html).toContain("Database unavailable.");
    expect(html).toContain("No staging matters have been opened yet");
  });

  it("renders search miss and saved-client fallback states", () => {
    const html = renderToStaticMarkup(
      <StagingMatterList
        matters={[
          {
            ...matter,
            clientDisplayName: null
          }
        ]}
        query="missing"
        databaseAvailable={true}
      />
    );

    expect(html).toContain("Saved client");
    expect(html).toContain("Clear");

    const emptyHtml = renderToStaticMarkup(
      <StagingMatterList
        matters={[]}
        query="missing"
        databaseAvailable={true}
      />
    );

    expect(emptyHtml).toContain("No staging matters match this search.");
  });
});
