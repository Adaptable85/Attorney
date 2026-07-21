import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ContactPage from "./page";

describe("contact public page", () => {
  it("renders contact links without an active form", () => {
    const html = renderToStaticMarkup(<ContactPage />);

    expect(html).toContain("Start with a clear conversation.");
    expect(html).toContain("stephanie@burgessinc.co.za");
    expect(html).toContain("078 749 6223");
    expect(html).toContain("10 Nuxia Street, Kuilsriver");
    expect(html).toContain("href=\"mailto:stephanie@burgessinc.co.za\"");
    expect(html).toContain("href=\"tel:+27787496223\"");
    expect(html).toContain("href=\"https://wa.me/27787496223\"");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Contact Us");
    expect(html).toContain("Keep the first message simple and safe.");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("action=");
    expect(html).not.toContain("type=\"submit\"");
    expect(html).not.toContain("href=\"/admin\"");
    expect(html).not.toContain("/admin/sign-in");
    expect(html).not.toContain("Yoco");
    expect(html).not.toContain("Payfast");
    expect(html).not.toContain("WhatsApp automation");
    expect(html.length).toBeGreaterThan(1400);
  });
});
