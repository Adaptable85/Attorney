import { describe, expect, it } from "vitest";

import { getDemoClientReviewRecord } from "./clients-review-data";
import { getDemoDocumentReviewRecord } from "./documents-review-data";
import { getDemoMatterReviewRecord } from "./matters-review-data";

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
  });

  it("returns null for unknown demo slugs", () => {
    expect(getDemoClientReviewRecord("real-client")).toBeNull();
    expect(getDemoMatterReviewRecord("real-matter")).toBeNull();
    expect(getDemoDocumentReviewRecord("real-document")).toBeNull();
  });
});
