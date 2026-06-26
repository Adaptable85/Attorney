import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdminAccessDenied } from "./admin-access-denied";

describe("admin access denied", () => {
  it("renders the password gate for password access reasons", () => {
    const html = renderToStaticMarkup(<AdminAccessDenied reason="password_required" />);

    expect(html).toContain("Staging Admin Access");
    expect(html).toContain("Enter the staging admin password");
    expect(html).not.toContain("Not authorized");
  });

  it("renders the standard not-authorized page for role failures", () => {
    const html = renderToStaticMarkup(<AdminAccessDenied reason="missing_admin_role" />);

    expect(html).toContain("Not authorized");
    expect(html).toContain("This user does not have an admin shell role.");
    expect(html).not.toContain("Staging Admin Access");
  });
});
