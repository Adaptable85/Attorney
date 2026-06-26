import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ContactPage from "./page";

describe("contact public page", () => {
  it("renders contact links without an active form", () => {
    const html = renderToStaticMarkup(<ContactPage />);

    expect(html).toContain("stephanie@burgessinc.co.za");
    expect(html).toContain("078 749 6223");
    expect(html).toContain("10 Nuxia Street, Kuilsriver");
    expect(html).toContain("href=\"mailto:stephanie@burgessinc.co.za\"");
    expect(html).toContain("Contact Us");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("action=");
    expect(html).not.toContain("type=\"submit\"");
    expect(html.length).toBeGreaterThan(1400);
  });
});
