import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MatterList } from "./matter-list";
import { demoMatterReviewRecords } from "./matters-review-data";

describe("matter list", () => {
  it("renders the read-only Matters Review module with demo records", () => {
    const html = renderToStaticMarkup(<MatterList matters={demoMatterReviewRecords} />);

    expect(html).toContain("Matters Review");
    expect(html).toContain("Demo data only.");
    expect(html).toContain("Read-only review mode");
    expect(html).toContain("Do not enter real matter data.");
    expect(html).toContain("Matter write paths are not enabled.");
    expect(html).toContain("Demo Property Transfer");
    expect(html).toContain("Demo Estate Planning Review");
    expect(html).toContain("Demo Supply Agreement Review");
    expect(html).toContain("Demo Dispute Response");
    expect(html).toContain("Demo Family Consultation");
    expect(html).toContain("/admin/matters/demo-property-transfer");
    expect(html.match(/Demo only/g)?.length).toBeGreaterThanOrEqual(5);
  });

  it("renders Stephanie review prompts and future workflow steps", () => {
    const html = renderToStaticMarkup(<MatterList matters={demoMatterReviewRecords} />);

    expect(html).toContain("Questions for Stephanie");
    expect(html).toContain("What matter types must Burgess support first?");
    expect(html).toContain("What should happen before a matter can be closed?");
    expect(html).toContain("Future matter workflow");
    expect(html).toContain("Critical dates captured");
    expect(html).toContain("No write path is enabled in this phase.");
  });

  it("does not render active matter workflow actions", () => {
    const html = renderToStaticMarkup(<MatterList matters={demoMatterReviewRecords} />);

    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("Save");
    expect(html).not.toContain("Submit");
    expect(html).not.toContain("Upload document");
    expect(html).not.toContain("Request approval");
  });
});
