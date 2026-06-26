import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ServicesPage from "./page";

describe("services public page", () => {
  it("renders grouped legal services and safety copy", () => {
    const html = renderToStaticMarkup(<ServicesPage />);

    expect(html).toContain("Our Services");
    expect(html).toContain("We Assist In");
    expect(html).toContain("Our Expertise");
    expect(html).toContain("Protecting Your Interest");
    expect(html).toContain("Litigation");
    expect(html).toContain("Family Law");
    expect(html).toContain("Road Accident Fund Claims");
    expect(html).toContain("not a guarantee");
    expect(html).not.toContain("Save");
    expect(html.length).toBeGreaterThan(2500);
  });
});
