import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ClientList } from "./client-list";

describe("client list", () => {
  const clients = [
    {
      id: "client_test_1",
      accountNumber: "TEST-001",
      displayName: "TEST Client File - Delete Later",
      status: "ACTIVE" as const,
      updatedAt: new Date("2026-07-15T09:00:00.000Z"),
      primaryContactName: "Test Contact",
      primaryContactEmail: "test@example.test",
      primaryContactPhone: "+27 00 000 0000"
    }
  ];

  it("renders the live staging client file list and search controls", () => {
    const html = renderToStaticMarkup(
      <ClientList
        clients={clients}
        query="TEST"
        writesEnabled
        databaseAvailable
        created
      />
    );

    expect(html).toContain("Client Files");
    expect(html).toContain("Live staging workspace");
    expect(html).toContain("Staging writes enabled");
    expect(html).toContain("Client file created.");
    expect(html).toContain("Search client files");
    expect(html).toContain("Open New Client File");
    expect(html).toContain("TEST Client File - Delete Later");
    expect(html).toContain("TEST-001");
    expect(html).toContain("/admin/clients/client_test_1");
  });

  it("shows disabled state when the staging write gate is off", () => {
    const html = renderToStaticMarkup(
      <ClientList
        clients={[]}
        query=""
        writesEnabled={false}
        databaseAvailable
        created={false}
      />
    );

    expect(html).toContain("Write gate off.");
    expect(html).toContain("BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED=true");
    expect(html).not.toContain("Open New Client File");
  });

  it("shows database unavailable state when staging storage cannot be reached", () => {
    const html = renderToStaticMarkup(
      <ClientList
        clients={[]}
        query=""
        writesEnabled
        databaseAvailable={false}
        created={false}
      />
    );

    expect(html).toContain("Database unavailable.");
    expect(html).toContain("No client files are available yet.");
    expect(html).not.toContain("Open New Client File");
  });

  it("shows the active empty-list copy when creation is available", () => {
    const html = renderToStaticMarkup(
      <ClientList
        clients={[]}
        query=""
        writesEnabled
        databaseAvailable
        created={false}
      />
    );

    expect(html).toContain("Use the new-client action");
    expect(html).toContain("Open New Client File");
  });

  it("shows no-match copy and clear action when search has no results", () => {
    const html = renderToStaticMarkup(
      <ClientList
        clients={[]}
        query="missing"
        writesEnabled
        databaseAvailable
        created={false}
      />
    );

    expect(html).toContain("No client files match this search.");
    expect(html).toContain("Clear");
  });

  it("does not render forbidden workflow actions", () => {
    const html = renderToStaticMarkup(
      <ClientList
        clients={clients}
        query=""
        writesEnabled
        databaseAvailable
        created={false}
      />
    );

    expect(html).not.toContain("Delete client");
    expect(html).not.toContain("Approve invoice");
    expect(html).not.toContain("Send statement");
    expect(html).not.toContain("Lexpro sync");
    expect(html).not.toContain("Yoco");
    expect(html).not.toContain("Payfast");
  });
});
