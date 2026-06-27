import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MatterDetail } from "./matter-detail";
import { demoMatterReviewRecords } from "./matters-review-data";

describe("matter detail", () => {
  const demoMatter = demoMatterReviewRecords[0];

  it("renders a demo-only matter detail preview", () => {
    const html = renderToStaticMarkup(<MatterDetail matter={demoMatter} />);

    expect(html).toContain("Demo matter preview");
    expect(html).toContain("Demo Property Transfer");
    expect(html).toContain("Demo only");
    expect(html).toContain("Demo Family Trust");
    expect(html).toContain("Property / conveyancing");
    expect(html).toContain("Linked document summary");
    expect(html).toContain("Client communication summary");
    expect(html).toContain("Billing/statement summary");
    expect(html).toContain("Audit/review note");
    expect(html).toContain("/admin/clients/demo-family-trust");
  });

  it("shows future actions as disabled labels only", () => {
    const html = renderToStaticMarkup(<MatterDetail matter={demoMatter} />);

    expect(html).toContain('data-disabled="true"');
    expect(html).toContain("Add matter");
    expect(html).toContain("Edit matter");
    expect(html).toContain("Close matter");
    expect(html).toContain("Upload document");
    expect(html).toContain("Request approval");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("action=");
  });
});
