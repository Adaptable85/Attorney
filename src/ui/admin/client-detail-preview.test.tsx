import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ClientDetailPreview } from "./client-detail-preview";
import { demoClientReviewRecords } from "./clients-review-data";

describe("client detail preview", () => {
  const demoClient = demoClientReviewRecords[0];

  it("renders a demo-only client detail preview", () => {
    const html = renderToStaticMarkup(<ClientDetailPreview client={demoClient} />);

    expect(html).toContain("Demo client preview");
    expect(html).toContain("Demo Family Trust");
    expect(html).toContain("Demo only");
    expect(html).toContain("Trust / estate");
    expect(html).toContain("Demo Trustee Contact");
    expect(html).toContain("Linked demo matters");
    expect(html).toContain("Linked demo documents");
    expect(html).toContain("Demo estate planning review");
    expect(html).toContain("Demo Signed Mandate");
    expect(html).toContain("Document status summary");
    expect(html).toContain("Billing/statement summary");
    expect(html).toContain("Audit/review note");
    expect(html).toContain("Future actions disabled");
  });

  it("shows future actions as disabled labels only", () => {
    const html = renderToStaticMarkup(<ClientDetailPreview client={demoClient} />);

    expect(html).toContain('data-disabled="true"');
    expect(html).toContain("Add client");
    expect(html).toContain("Edit client");
    expect(html).toContain("Archive client");
    expect(html).toContain("Upload document");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("action=");
  });
});
