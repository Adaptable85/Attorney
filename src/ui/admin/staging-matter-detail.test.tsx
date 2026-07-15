import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { StagingMatterDetail } from "./staging-matter-detail";

describe("staging matter detail", () => {
  it("renders a read-focused live staging matter", () => {
    const html = renderToStaticMarkup(
      <StagingMatterDetail
        matter={{
          id: "matter_1",
          clientId: "client_1",
          clientDisplayName: "TEST Client File - Delete Later",
          accountNumber: "TEST-MATTER-001",
          name: "TEST Matter - Delete Later",
          description: "Staging test matter",
          type: "OTHER",
          status: "OPEN",
          nextStepDueDate: new Date("2026-07-30T00:00:00.000Z"),
          updatedAt: new Date("2026-07-15T09:00:00.000Z")
        }}
      />
    );

    expect(html).toContain("Live staging matter");
    expect(html).toContain("TEST Matter - Delete Later");
    expect(html).toContain("/admin/clients/client_1");
    expect(html).toContain("2026-07-30");
    expect(html).toContain("Edit matter unavailable");
    expect(html).toContain("Close matter unavailable");
    expect(html).toContain("Statement sending unavailable");
    expect(html).not.toContain("Approve invoice");
    expect(html).not.toContain("Send statement");
  });

  it("renders safe fallbacks for missing optional matter fields", () => {
    const html = renderToStaticMarkup(
      <StagingMatterDetail
        matter={{
          id: "matter_1",
          clientId: "client_1",
          clientDisplayName: null,
          accountNumber: "TEST-MATTER-001",
          name: "TEST Matter - Delete Later",
          description: "Staging test matter",
          type: "OTHER",
          status: "OPEN",
          nextStepDueDate: null,
          updatedAt: new Date("2026-07-15T09:00:00.000Z")
        }}
      />
    );

    expect(html).toContain("Saved client");
    expect(html).toContain("Not set");
  });
});
