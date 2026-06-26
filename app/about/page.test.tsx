import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AboutPage from "./page";

describe("about public page", () => {
  it("renders boutique firm positioning without admin content", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain("About Burgess Attorneys");
    expect(html).toContain("A short insight About Us");
    expect(html).toContain("1 September 2021");
    expect(html).toContain("Traditional values, applied innovatively");
    expect(html).toContain("Kuils River");
    expect(html).toContain("no website statement should be read as a guarantee");
    expect(html).not.toContain("Admin Platform Foundation");
    expect(html.length).toBeGreaterThan(1800);
  });
});
