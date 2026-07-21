import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("home page", () => {
  it("renders visible non-empty Burgess Attorneys public website content", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Burgess Attorneys");
    expect(html).toContain("%2Fbrand%2Fburgess-logo-header.png");
    expect(html).toContain("Welcome to Burgess Attorneys");
    expect(html).toContain("How can we be of assistance?");
    expect(html).toContain("Speak to Stephanie");
    expect(html).toContain("A short insight about Burgess Attorneys");
    expect(html).toContain("Analysing Your Case");
    expect(html).toContain("Taking Steps Forward");
    expect(html).toContain("Court Of Law Success");
    expect(html).toContain("Your success drives our commitment");
    expect(html).toContain("Information, support and practical legal direction.");
    expect(html).toContain("Contact Us");
    expect(html).toContain("Stephanie Burgess");
    expect(html).toContain("journey from Pretoria to Cape Town");
    expect(html).toContain("Testimonials");
    expect(html).toContain("href=\"/services\"");
    expect(html).not.toContain("href=\"/admin\"");
    expect(html).not.toContain("href=\"/admin/");
    expect(html).not.toContain("/admin/sign-in");
    expect(html).not.toContain("Admin Platform Foundation");
    expect(html.length).toBeGreaterThan(3200);
  });
});
