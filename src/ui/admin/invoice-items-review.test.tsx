import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { InvoiceItemsReview } from "./invoice-items-review";

const billingItems = [
  {
    id: "billing_template_1",
    label: "Consultation",
    category: "TIME" as const,
    description: "Reusable consultation item",
    amountCents: 85000,
    currency: "ZAR",
    vatTreatment: "VAT_ON_FEES" as const,
    status: "ACTIVE" as const,
    updatedAt: new Date("2026-07-15T09:00:00.000Z")
  }
];

describe("invoice items review", () => {
  it("renders editable staging reusable billing item forms when enabled", () => {
    const html = renderToStaticMarkup(
      <InvoiceItemsReview
        billingItems={billingItems}
        writesEnabled={true}
        databaseAvailable={true}
        saved={false}
      />
    );

    expect(html).toContain("Invoice Items");
    expect(html).toContain("Reusable billing building blocks");
    expect(html).toContain("Add billing item");
    expect(html).toContain("compact-admin-form");
    expect(html).toContain("Short reusable billing item name shown in lists.");
    expect(html).toContain("Store money as integer cents");
    expect(html).toContain("Save Billing Item");
    expect(html).toContain("Update Billing Item");
    expect(html).toContain("Consultation");
    expect(html).toContain("85000 cents");
    expect(html).toContain("Vat On Fees");
    expect(html).toContain("action=\"/admin/invoice-items/create\"");
  });

  it("keeps invoice approval and statement sending unavailable", () => {
    const html = renderToStaticMarkup(
      <InvoiceItemsReview
        billingItems={billingItems}
        writesEnabled={false}
        databaseAvailable={true}
        saved={false}
      />
    );

    expect(html).toContain("Edit gate off");
    expect(html).toContain("No invoice can be approved.");
    expect(html).toContain("No invoice number can be assigned.");
    expect(html).toContain("No statement can be sent.");
    expect(html).toContain("disabled=\"\"");
    expect(html).not.toContain("Yoco");
    expect(html).not.toContain("Payfast");
    expect(html).not.toContain("checkout");
  });

  it("renders saved, error, database and empty states", () => {
    const html = renderToStaticMarkup(
      <InvoiceItemsReview
        billingItems={[]}
        writesEnabled={false}
        databaseAvailable={false}
        saved={true}
        error="Test error"
      />
    );

    expect(html).toContain("Reusable billing item saved.");
    expect(html).toContain("Billing item not saved.");
    expect(html).toContain("Test error");
    expect(html).toContain("Database unavailable.");
    expect(html).toContain("No billing items saved yet");
  });
});
