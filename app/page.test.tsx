import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("home page", () => {
  it("renders visible non-empty Burgess Attorneys public website content", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Burgess Attorneys");
    expect(html).toContain("Boutique legal services in Kuils River");
    expect(html).toContain("Contact Us");
    expect(html).toContain("Stephanie Burgess");
    expect(html).toContain("href=\"/services\"");
    expect(html).not.toContain("Admin Platform Foundation");
    expect(html.length).toBeGreaterThan(2500);
  });
});
