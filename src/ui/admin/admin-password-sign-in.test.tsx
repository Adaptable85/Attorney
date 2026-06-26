import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdminPasswordSignIn } from "./admin-password-sign-in";

describe("admin password sign-in", () => {
  it("renders a disabled form when staging password access is disabled", () => {
    const html = renderToStaticMarkup(<AdminPasswordSignIn reason="password_access_disabled" />);

    expect(html).toContain("Staging password access is disabled.");
    expect(html).toContain("disabled");
    expect(html).toContain("action=\"/admin/password-session\"");
  });

  it("renders a disabled form when staging password access is unconfigured", () => {
    const html = renderToStaticMarkup(<AdminPasswordSignIn reason="password_access_unconfigured" />);

    expect(html).toContain("Staging password access is not configured.");
    expect(html).toContain("disabled");
  });

  it("renders a generic error for incorrect passwords", () => {
    const html = renderToStaticMarkup(
      <AdminPasswordSignIn reason="password_required" hasError />
    );

    expect(html).toContain("The password could not be verified.");
    expect(html).not.toContain("disabled");
  });
});
