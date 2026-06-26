import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdminSectionReview } from "./admin-section-review";
import { adminSectionReviews } from "./admin-section-review-data";

describe("admin section review", () => {
  it("renders billing as read-only without external collection controls", () => {
    const html = renderToStaticMarkup(
      <AdminSectionReview section={adminSectionReviews.billing} />
    );

    expect(html).toContain("Billing, Invoices and Statements");
    expect(html).toContain("Read-only placeholder");
    expect(html).toContain("No approve, assign-number or send action exists.");
    expect(html).toContain("No external collection provider or online collection action is present.");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("Save");
    expect(html).not.toContain("Submit");
  });

  it("renders access control review while keeping live auth and writes disabled", () => {
    const html = renderToStaticMarkup(
      <AdminSectionReview section={adminSectionReviews.access} />
    );

    expect(html).toContain("Settings and Access Control");
    expect(html).toContain("Live Microsoft Entra auth, UI saves and production writes remain off.");
    expect(html).toContain("No live Microsoft redirect, token exchange or session wiring is enabled.");
    expect(html).not.toContain("<button");
  });
});
