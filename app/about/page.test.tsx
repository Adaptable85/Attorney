import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AboutPage from "./page";

describe("about public page", () => {
  it("renders boutique firm positioning without admin content", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain("About Burgess Attorneys");
    expect(html).toContain("Personal legal service with practical focus");
    expect(html).toContain("Kuils River");
    expect(html).toContain("no website statement should be read as a guarantee");
    expect(html).not.toContain("Admin Platform Foundation");
    expect(html.length).toBeGreaterThan(1800);
  });
});
