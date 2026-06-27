import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DocumentDetailPreview } from "./document-detail-preview";
import { demoDocumentReviewRecords } from "./documents-review-data";

describe("document detail preview", () => {
  const demoDocument = demoDocumentReviewRecords[0];

  it("renders a demo-only document metadata preview", () => {
    const html = renderToStaticMarkup(
      <DocumentDetailPreview document={demoDocument} />
    );

    expect(html).toContain("Demo document preview");
    expect(html).toContain("Demo FICA Identity Pack");
    expect(html).toContain("Demo only");
    expect(html).toContain("FICA / identity");
    expect(html).toContain("Demo Individual Client");
    expect(html).toContain("Demo Family Consultation");
    expect(html).toContain("Storage and confidentiality");
    expect(html).toContain("No file storage, upload or download is enabled.");
    expect(html).toContain("/admin/clients/demo-individual-client");
    expect(html).toContain("/admin/matters/demo-family-consultation");
  });

  it("shows future actions as disabled labels only", () => {
    const html = renderToStaticMarkup(
      <DocumentDetailPreview document={demoDocument} />
    );

    expect(html).toContain('data-disabled="true"');
    expect(html).toContain("Upload document");
    expect(html).toContain("Replace document");
    expect(html).toContain("Download document");
    expect(html).toContain("Archive document");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("action=");
  });
});
