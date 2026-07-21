import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ServicesPage from "./page";

describe("services public page", () => {
  it("renders grouped legal services and safety copy", () => {
    const html = renderToStaticMarkup(<ServicesPage />);

    expect(html).toContain("Services grouped around the problem you need to solve.");
    expect(html).toContain("Family and personal matters");
    expect(html).toContain("Business and commercial support");
    expect(html).toContain("Litigation and dispute resolution");
    expect(html).toContain("Property, estates and planning");
    expect(html).toContain("Private client and family");
    expect(html).toContain("Commercial and recovery");
    expect(html).toContain("Litigation");
    expect(html).toContain("Family Law");
    expect(html).toContain("Road Accident Fund Claims");
    expect(html).toContain("not a guarantee");
    expect(html).not.toContain("Save");
    expect(html).not.toContain("Yoco");
    expect(html).not.toContain("Payfast");
    expect(html).not.toContain("checkout");
    expect(html.length).toBeGreaterThan(2500);
  });
});
