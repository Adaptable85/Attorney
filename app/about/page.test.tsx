import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AboutPage from "./page";

describe("about public page", () => {
  it("renders boutique firm positioning without admin content", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain("About Burgess Attorneys");
    expect(html).toContain("A boutique firm built around personal attention.");
    expect(html).toContain("1 September 2021");
    expect(html).toContain("About Stephanie");
    expect(html).toContain("Stephanie Burgess");
    expect(html).toContain("%2Fbrand%2Fstephanie-burgess.jpg");
    expect(html).toContain("practical pressure a matter can place");
    expect(html).toContain("Direct attorney contact");
    expect(html).toContain("Careful boundaries");
    expect(html).toContain("Traditional values, applied innovatively");
    expect(html).toContain("Kuils River");
    expect(html).toContain("no website statement should be read as a guarantee");
    expect(html).not.toContain("Admin Platform Foundation");
    expect(html.length).toBeGreaterThan(1800);
  });
});
