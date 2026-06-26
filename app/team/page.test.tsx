import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TeamPage from "./page";

describe("team public page", () => {
  it("renders Stephanie Burgess profile details", () => {
    const html = renderToStaticMarkup(<TeamPage />);

    expect(html).toContain("Stephanie Burgess");
    expect(html).toContain("University of Pretoria");
    expect(html).toContain("Admitted attorney");
    expect(html).toContain("Insolvency Practitioner");
    expect(html).not.toContain("Production writes");
    expect(html.length).toBeGreaterThan(1700);
  });
});
