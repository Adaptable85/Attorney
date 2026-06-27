import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ClientList } from "./client-list";
import { demoClientReviewRecords } from "./clients-review-data";

describe("client list", () => {
  it("renders the read-only Clients Review module with demo records", () => {
    const html = renderToStaticMarkup(<ClientList clients={demoClientReviewRecords} />);

    expect(html).toContain("Clients Review");
    expect(html).toContain("Demo data only.");
    expect(html).toContain("Read-only review mode");
    expect(html).toContain("Do not enter real client data.");
    expect(html).toContain("Client write paths are not enabled.");
    expect(html).toContain("Demo Family Trust");
    expect(html).toContain("Demo Kuils River Trading Pty Ltd");
    expect(html).toContain("Demo Individual Client");
    expect(html).toContain("Demo Repeat Commercial Client");
    expect(html).toContain("/admin/clients/demo-family-trust");
    expect(html.match(/Demo only/g)?.length).toBeGreaterThanOrEqual(4);
  });

  it("renders Stephanie review prompts and future workflow steps", () => {
    const html = renderToStaticMarkup(<ClientList clients={demoClientReviewRecords} />);

    expect(html).toContain("Questions for Stephanie");
    expect(html).toContain("Should Burgess manage both individuals and organisations as clients?");
    expect(html).toContain("Should archived clients remain searchable?");
    expect(html).toContain("Future client workflow");
    expect(html).toContain("Conflict/basic duplicate check");
    expect(html).toContain("No write path is enabled in this phase.");
  });

  it("does not render active client mutation actions", () => {
    const html = renderToStaticMarkup(<ClientList clients={demoClientReviewRecords} />);

    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("Delete client");
    expect(html).not.toContain("Save");
    expect(html).not.toContain("Submit");
    expect(html).not.toContain("Upload document");
  });
});
