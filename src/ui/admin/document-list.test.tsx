import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DocumentList } from "./document-list";
import { demoDocumentReviewRecords } from "./documents-review-data";

describe("document list", () => {
  it("renders the read-only Documents Review module with demo metadata", () => {
    const html = renderToStaticMarkup(
      <DocumentList documents={demoDocumentReviewRecords} />
    );

    expect(html).toContain("Documents Review");
    expect(html).toContain("Demo metadata only.");
    expect(html).toContain("No real upload.");
    expect(html).toContain("No real download.");
    expect(html).toContain("No real document storage.");
    expect(html).toContain("Demo FICA Identity Pack");
    expect(html).toContain("Demo Signed Mandate");
    expect(html).toContain("Demo Title Deed Copy");
    expect(html).toContain("Demo Notice Bundle");
    expect(html).toContain("Demo Trust Deed Extract");
    expect(html).toContain("Demo Client Correspondence");
    expect(html).toContain("/admin/documents/demo-fica-pack");
    expect(html.match(/Demo only/g)?.length).toBeGreaterThanOrEqual(6);
  });

  it("renders Stephanie document review prompts", () => {
    const html = renderToStaticMarkup(
      <DocumentList documents={demoDocumentReviewRecords} />
    );

    expect(html).toContain("Questions for Stephanie");
    expect(html).toContain("Which document categories are required first?");
    expect(html).toContain("Should documents ever be deleted, or only archived?");
  });

  it("does not render active document controls", () => {
    const html = renderToStaticMarkup(
      <DocumentList documents={demoDocumentReviewRecords} />
    );

    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("Save");
    expect(html).not.toContain("Submit");
    expect(html).not.toContain("Upload document");
    expect(html).not.toContain("Download document");
  });
});
