import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ClientDetailPreview } from "./client-detail-preview";
import { demoClientReviewRecords } from "./clients-review-data";

describe("client detail preview", () => {
  const demoClient = demoClientReviewRecords[0];

  it("renders a demo-only client detail preview", () => {
    const html = renderToStaticMarkup(<ClientDetailPreview client={demoClient} />);

    expect(html).toContain("Demo client file");
    expect(html).toContain("Demo Family Trust");
    expect(html).toContain("Client file first");
    expect(html).toContain("Trust / estate");
    expect(html).toContain("Demo Trustee Contact");
    expect(html).toContain("Matters inside this file");
    expect(html).toContain("Client General Documents");
    expect(html).toContain("Client Statement");
    expect(html).toContain("voice-note summaries and draft invoices belong inside each matter");
    expect(html).toContain("Audit History");
    expect(html).toContain("Demo estate planning review");
    expect(html).toContain("Demo Signed Mandate");
    expect(html).toContain("Demo_Family_Trust_Demo_Property_Transfer_Mandate_2026-06-18");
    expect(html).not.toContain("Billing Item Library");
    expect(html).not.toContain("Reusable Invoice Items");
    expect(html).not.toContain("Review invoice item library");
    expect(html).not.toContain("Notes / Voice Notes");
    expect(html).not.toContain("Draft Invoices");
    expect(html).toContain("Future actions disabled");
  });

  it("shows future actions as disabled labels only", () => {
    const html = renderToStaticMarkup(<ClientDetailPreview client={demoClient} />);

    expect(html).toContain('data-disabled="true"');
    expect(html).toContain("Create client file");
    expect(html).toContain("Edit client details");
    expect(html).toContain("Archive client file");
    expect(html).toContain("Upload document");
    expect(html).toContain("Invoice approval unavailable");
    expect(html).toContain("Statement sending unavailable");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("action=");
  });
});
