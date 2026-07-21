import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("home page", () => {
  it("renders visible non-empty Burgess Attorneys public website content", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Burgess Attorneys");
    expect(html).toContain("%2Fbrand%2Fburgess-logo-header.png");
    expect(html).toContain("Boutique legal support in Kuils River");
    expect(html).toContain("Practical legal guidance, handled with personal attention.");
    expect(html).toContain("Speak to Stephanie");
    expect(html).toContain("What do you need help with?");
    expect(html).toContain("Family and personal matters");
    expect(html).toContain("Business and commercial support");
    expect(html).toContain("Litigation and dispute resolution");
    expect(html).toContain("Property, estates and planning");
    expect(html).toContain("Meet Stephanie Burgess");
    expect(html).toContain("A personal firm with serious legal foundations");
    expect(html).toContain("Start with a clear conversation");
    expect(html).toContain("Contact Us");
    expect(html).toContain("LLB Degree from the University of Pretoria");
    expect(html).toContain("Client words, responsibly presented.");
    expect(html).toContain("href=\"/services\"");
    expect(html).not.toContain("href=\"/admin\"");
    expect(html).not.toContain("href=\"/admin/");
    expect(html).not.toContain("/admin/sign-in");
    expect(html).not.toContain("Admin Platform Foundation");
    expect(html).not.toContain("Yoco");
    expect(html).not.toContain("Payfast");
    expect(html).not.toContain("WhatsApp");
    expect(html).not.toContain("Lexpro");
    expect(html.length).toBeGreaterThan(5200);
  });
});
