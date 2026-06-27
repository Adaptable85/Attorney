import { describe, expect, it } from "vitest";

import { getDemoClientReviewRecord } from "./clients-review-data";
import { getDemoDocumentReviewRecord } from "./documents-review-data";
import { getDemoMatterReviewRecord } from "./matters-review-data";
import {
  getDemoAuditTimelineRecord,
  getDemoBillingReviewRecord,
  getDemoLexproBoundaryItem
} from "./back-office-review-data";

describe("core review demo data lookups", () => {
  it("finds approved demo records by slug", () => {
    expect(getDemoClientReviewRecord("demo-family-trust")?.displayName).toBe(
      "Demo Family Trust"
    );
    expect(getDemoMatterReviewRecord("demo-property-transfer")?.title).toBe(
      "Demo Property Transfer"
    );
    expect(getDemoDocumentReviewRecord("demo-fica-pack")?.name).toBe(
      "Demo FICA Identity Pack"
    );
    expect(getDemoBillingReviewRecord("demo-statement-review")?.title).toBe(
      "Demo family trust statement review"
    );
    expect(getDemoLexproBoundaryItem("demo-trust-accounting-boundary")?.boundaryArea).toBe(
      "Trust and accounting records"
    );
    expect(getDemoAuditTimelineRecord("demo-client-viewed")?.actionType).toBe(
      "Viewed client"
    );
  });

  it("returns null for unknown demo slugs", () => {
    expect(getDemoClientReviewRecord("real-client")).toBeNull();
    expect(getDemoMatterReviewRecord("real-matter")).toBeNull();
    expect(getDemoDocumentReviewRecord("real-document")).toBeNull();
    expect(getDemoBillingReviewRecord("real-billing")).toBeNull();
    expect(getDemoLexproBoundaryItem("real-lexpro")).toBeNull();
    expect(getDemoAuditTimelineRecord("real-audit")).toBeNull();
  });
});
