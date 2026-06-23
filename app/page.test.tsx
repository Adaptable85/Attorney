import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("home page", () => {
  it("renders visible non-empty Attorney platform content", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Burgess Attorneys");
    expect(html).toContain("Admin Platform Foundation");
    expect(html).toContain("Open admin shell");
    expect(html).toContain("href=\"/admin\"");
    expect(html.length).toBeGreaterThan(200);
  });
});
