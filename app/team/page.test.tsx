import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TeamPage from "./page";

describe("team public page", () => {
  it("renders Stephanie Burgess profile details", () => {
    const html = renderToStaticMarkup(<TeamPage />);

    expect(html).toContain("Stephanie Burgess");
    expect(html).toContain("Ladies with a passion for justice");
    expect(html).toContain("Pretoria to Cape Town");
    expect(html).toContain("University of Pretoria");
    expect(html).toContain("Admitted Attorney of the High Court in Cape Town");
    expect(html).toContain("Insolvency Practitioner");
    expect(html).not.toContain("Production writes");
    expect(html.length).toBeGreaterThan(1700);
  });
});
