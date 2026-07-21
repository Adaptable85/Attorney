import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TestimonialsPage from "./page";

describe("testimonials public page", () => {
  it("renders the public testimonial route without outcome guarantees", () => {
    const html = renderToStaticMarkup(<TestimonialsPage />);

    expect(html).toContain("What do our clients say");
    expect(html).toContain("In Our Testimonials");
    expect(html).toContain("Vaughn Brazier");
    expect(html).toContain("Amber Africa");
    expect(html).toContain("Geraldine Pekeur");
    expect(html).toContain("Jeraydo Hattingh");
    expect(html).toContain("Ivan Gordon");
    expect(html).toContain("I was treated with the absolute best service. 10/10 recommended!");
    expect(html).toContain("no outcome is guaranteed");
    expect(html).toContain("href=\"/testimonials\"");
    expect(html).not.toContain("<form");
    expect(html.length).toBeGreaterThan(1500);
  });
});
