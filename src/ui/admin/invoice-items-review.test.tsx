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
    expect(html).toContain("preparation inside matters");
    expect(html).toContain("Invoice item register");
    expect(html).toContain("practice-table--invoice-items");
    expect(html).toContain("Item filters");
    expect(html).toContain("Search invoice items");
    expect(html).toContain("action=\"/admin/invoice-items\"");
    expect(html).toContain("Add Invoice Item");
    expect(html).toContain("href=\"#add-invoice-item\"");
    expect(html).toContain("Reusable templates appear in matter billing dropdowns.");
    expect(html).toContain("compact-admin-form");
    expect(html).toContain("Short reusable billing item name shown in lists.");
    expect(html).toContain("Store money as integer cents");
    expect(html).toContain("Save Billing Item");
    expect(html).toContain("Update Billing Item");
    expect(html).toContain("Consultation");
    expect(html).toContain("Reusable consultation item");
    expect(html).toContain("R 850,00");
    expect(html).toContain("85000 cents");
    expect(html).toContain("Vat On Fees");
    expect(html).toContain("2026-07-15");
    expect(html).toContain("href=\"#edit-billing_template_1\"");
    expect(html).toContain("action=\"/admin/invoice-items/create\"");
    expect(html).toContain("action=\"/admin/invoice-items/billing_template_1/update\"");
    expect(html).not.toContain("aria-label=\"Reusable billing item list\"");
  });

  it("filters invoice items by query without changing create or update routes", () => {
    const html = renderToStaticMarkup(
      <InvoiceItemsReview
        billingItems={[
          ...billingItems,
          {
            id: "billing_template_2",
            label: "Filing fee",
            category: "DISBURSEMENT" as const,
            description: "Court filing disbursement",
            amountCents: 120000,
            currency: "ZAR",
            vatTreatment: "NO_VAT" as const,
            status: "ACTIVE" as const,
            updatedAt: new Date("2026-07-16T09:00:00.000Z")
          }
        ]}
        query="filing"
        writesEnabled={true}
        databaseAvailable={true}
        saved={false}
      />
    );

    expect(html).toContain("Search");
    expect(html).toContain("Active");
    expect(html).toContain("Filing fee");
    expect(html).toContain("Court filing disbursement");
    expect(html).not.toContain("Reusable consultation item");
    expect(html).toContain("action=\"/admin/invoice-items/create\"");
    expect(html).toContain("action=\"/admin/invoice-items/billing_template_2/update\"");
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
    expect(html).toContain("Add Invoice Item disabled");
    expect(html).toContain("Edit disabled");
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

  it("renders an empty search result state", () => {
    const html = renderToStaticMarkup(
      <InvoiceItemsReview
        billingItems={billingItems}
        query="missing"
        writesEnabled={true}
        databaseAvailable={true}
        saved={false}
      />
    );

    expect(html).toContain("No invoice items match this search");
    expect(html).toContain("Clear the filter");
    expect(html).not.toContain("Reusable consultation item");
  });
});
