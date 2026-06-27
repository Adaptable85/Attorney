import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  AccessControlReview,
  AuditEventDetail,
  AuditTrailReview,
  BillingDetailPreview,
  BillingReview,
  LexproBoundaryDetail,
  LexproBoundaryReview
} from "./back-office-review";
import {
  demoAuditTimelineRecords,
  demoBillingReviewRecords,
  demoLexproBoundaryItems
} from "./back-office-review-data";

const inactiveMarkupExpectations = (html: string) => {
  expect(html).not.toContain("<button");
  expect(html).not.toContain("<form");
  expect(html).not.toContain("type=\"submit\"");
  expect(html).not.toContain("Save changes");
  expect(html).not.toContain("Submit");
};

describe("back-office review modules", () => {
  it("renders Billing Review with demo records, prompts and disabled future actions", () => {
    const html = renderToStaticMarkup(
      <BillingReview records={demoBillingReviewRecords} />
    );

    expect(html).toContain("Billing Review");
    expect(html).toContain("Demo only. Read-only review.");
    expect(html).toContain("No real invoices.");
    expect(html).toContain("No real statements.");
    expect(html).toContain("No payment collection.");
    expect(html).toContain("Demo family trust statement review");
    expect(html).toContain("Demo future invoice design review");
    expect(html).toContain("/admin/billing/demo-statement-review");
    expect(html.match(/Data label/g)?.length).toBeGreaterThanOrEqual(6);
    expect(html).toContain("Questions for Stephanie");
    expect(html).toContain("Should Burgess review draft invoices inside this platform?");
    expect(html).toContain("Create invoice");
    expect(html).toContain("Download PDF");
    inactiveMarkupExpectations(html);
  });

  it("renders Lexpro Boundary Review with six boundary items and no live integration controls", () => {
    const html = renderToStaticMarkup(
      <LexproBoundaryReview items={demoLexproBoundaryItems} />
    );

    expect(html).toContain("Lexpro Boundary Review");
    expect(html).toContain("No live Lexpro integration.");
    expect(html).toContain("No API calls.");
    expect(html).toContain("No sync.");
    expect(html).toContain("Client master data");
    expect(html).toContain("Trust and accounting records");
    expect(html).toContain("/admin/lexpro/demo-trust-accounting-boundary");
    expect(html.match(/Required approval before integration/g)?.length).toBeGreaterThanOrEqual(6);
    expect(html).toContain("Which data must remain only in Lexpro?");
    expect(html).toContain("Connect Lexpro");
    expect(html).toContain("Run reconciliation");
    inactiveMarkupExpectations(html);
  });

  it("renders Audit Trail Review with eight demo timeline records", () => {
    const html = renderToStaticMarkup(
      <AuditTrailReview records={demoAuditTimelineRecords} />
    );

    expect(html).toContain("Audit Trail Review");
    expect(html).toContain("No real audit events.");
    expect(html).toContain("No production audit writes.");
    expect(html).toContain("Viewed client");
    expect(html).toContain("Login/session event");
    expect(html).toContain("/admin/audit/demo-client-viewed");
    expect(html.match(/Data label/g)?.length).toBeGreaterThanOrEqual(8);
    expect(html).toContain("What actions must always be audited?");
    expect(html).toContain("Export audit log");
    expect(html).toContain("Delete event");
    inactiveMarkupExpectations(html);
  });

  it("renders Access Control Review with the required proposed roles", () => {
    const html = renderToStaticMarkup(<AccessControlReview />);

    expect(html).toContain("Access Control Review");
    expect(html).toContain("Staging password access is active for");
    expect(html).toContain("No role changes enabled.");
    expect(html).toContain("Principal Attorney / Owner");
    expect(html).toContain("Attorney / Professional Staff");
    expect(html).toContain("Admin / Reception");
    expect(html).toContain("Finance / Billing Reviewer");
    expect(html).toContain("Build Support");
    expect(html).toContain("Draft-only Assistant / Service User");
    expect(html).toContain("Read-Only Reviewer");
    expect(html).toContain("Who should be the production owner?");
    expect(html).toContain("Invite user");
    expect(html).toContain("View secrets");
    inactiveMarkupExpectations(html);
  });

  it("renders demo detail previews without active write controls", () => {
    const billingHtml = renderToStaticMarkup(
      <BillingDetailPreview record={demoBillingReviewRecords[0]} />
    );
    const lexproHtml = renderToStaticMarkup(
      <LexproBoundaryDetail item={demoLexproBoundaryItems[3]} />
    );
    const auditHtml = renderToStaticMarkup(
      <AuditEventDetail record={demoAuditTimelineRecords[0]} />
    );

    expect(billingHtml).toContain("Demo family trust statement review");
    expect(billingHtml).toContain("Proposed line-item summary");
    expect(billingHtml).toContain("Back to Billing Review");
    expect(lexproHtml).toContain("Trust and accounting records");
    expect(lexproHtml).toContain("Data boundary");
    expect(lexproHtml).toContain("Back to Lexpro Boundary Review");
    expect(auditHtml).toContain("Viewed client");
    expect(auditHtml).toContain("Event metadata");
    expect(auditHtml).toContain("Back to Audit Trail Review");

    inactiveMarkupExpectations(billingHtml);
    inactiveMarkupExpectations(lexproHtml);
    inactiveMarkupExpectations(auditHtml);
  });
});
