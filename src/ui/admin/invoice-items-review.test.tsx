import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { InvoiceItemsReview } from "./invoice-items-review";

describe("invoice items review", () => {
  it("renders reusable invoice item placeholders", () => {
    const html = renderToStaticMarkup(<InvoiceItemsReview />);

    expect(html).toContain("Invoice Items Review");
    expect(html).toContain("Reusable billing building blocks");
    expect(html).toContain("Consultation");
    expect(html).toContain("Drafting");
    expect(html).toContain("Correspondence");
    expect(html).toContain("Stored as");
    expect(html).toContain("85000 cents");
    expect(html).toContain("VAT configurable");
  });

  it("keeps invoice item actions disabled and approval safe", () => {
    const html = renderToStaticMarkup(<InvoiceItemsReview />);

    expect(html).toContain("Owner/principal approval remains mandatory.");
    expect(html).toContain("AI may suggest draft invoice items");
    expect(html).toContain("Create invoice item");
    expect(html).toContain("Assign invoice number");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("action=");
    expect(html).not.toContain("Yoco");
    expect(html).not.toContain("Payfast");
    expect(html).not.toContain("checkout");
  });
});
