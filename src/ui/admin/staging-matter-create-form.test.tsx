import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { StagingMatterCreateForm } from "./staging-matter-create-form";

const client = {
  id: "client_test_1",
  accountNumber: "TEST-001",
  displayName: "TEST Client File - Delete Later",
  status: "ACTIVE" as const,
  updatedAt: new Date("2026-07-15T09:00:00.000Z"),
  primaryContactName: "Test Contact",
  primaryContactEmail: "test@example.test",
  primaryContactPhone: "+27 00 000 0000"
};

describe("staging matter create form", () => {
  it("renders active staging matter fields when enabled", () => {
    const html = renderToStaticMarkup(
      <StagingMatterCreateForm
        client={client}
        writesEnabled={true}
        databaseAvailable={true}
      />
    );

    expect(html).toContain("Open New Matter");
    expect(html).toContain("compact-admin-form");
    expect(html).toContain("The matter will be opened inside this saved client file.");
    expect(html).toContain("Summarise the test matter context.");
    expect(html).toContain("/admin/clients/client_test_1/matters/create");
    expect(html).toContain("TEST Client File - Delete Later");
    expect(html).toContain("TEST-MATTER-001");
    expect(html).toContain("Save Staging Matter");
    expect(html).toContain("Family Law");
    expect(html).not.toContain("Edit matter");
    expect(html).not.toContain("Close matter");
    expect(html).not.toContain("Send statement");
  });

  it("renders a safe disabled state when gate is off", () => {
    const html = renderToStaticMarkup(
      <StagingMatterCreateForm
        client={client}
        writesEnabled={false}
        databaseAvailable={true}
        error="Gate test error"
      />
    );

    expect(html).toContain("Matter creation unavailable.");
    expect(html).toContain("BURGESS_STAGING_MATTER_WRITES_ENABLED=true");
    expect(html).toContain("Gate test error");
    expect(html).toContain("disabled=\"\"");
  });
});
