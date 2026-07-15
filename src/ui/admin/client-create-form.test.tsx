import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ClientCreateForm } from "./client-create-form";

describe("client create form foundation", () => {
  it("renders active staging client file fields when gate and database are available", () => {
    const html = renderToStaticMarkup(
      <ClientCreateForm writesEnabled databaseAvailable />
    );

    expect(html).toContain("Open New Client File");
    expect(html).toContain("Staging test save enabled");
    expect(html).toContain("Account/reference number");
    expect(html).toContain("compact-admin-form");
    expect(html).toContain("Use a staging test reference that you can search later.");
    expect(html).toContain("The name shown in the client-file list and client header.");
    expect(html).toContain("Primary contact name");
    expect(html).toContain("Opening note");
    expect(html).toContain("Save Staging Client File");
    expect(html).toContain('action="/admin/clients/create"');
    expect(html).not.toContain("disabled");
  });

  it("renders disabled staging client fields when gate is off", () => {
    const html = renderToStaticMarkup(
      <ClientCreateForm writesEnabled={false} databaseAvailable />
    );

    expect(html).toContain("Open New Client File");
    expect(html).toContain("Staging write gate off");
    expect(html).toContain("Do not enter real Burgess");
    expect(html).toContain("Creation unavailable.");
    expect(html).toContain("disabled");
  });

  it("renders a safe creation error without enabling the form", () => {
    const html = renderToStaticMarkup(
      <ClientCreateForm
        writesEnabled={false}
        databaseAvailable={false}
        error="Staging client file writes are not enabled for this session."
      />
    );

    expect(html).toContain("Client file not saved.");
    expect(html).toContain("Staging client file writes are not enabled");
    expect(html).toContain("Creation unavailable.");
    expect(html).toContain("disabled");
  });
});
