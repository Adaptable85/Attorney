import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdminShell } from "./admin-shell";
import { AdminHeader } from "./admin-header";
import { getVisibleAdminModules } from "./admin-modules";

const ownerPrincipal = {
  userId: "owner",
  email: "owner@example.test",
  roles: ["OWNER_PRINCIPAL" as const],
  provider: "local_dev_placeholder" as const
};

describe("admin shell", () => {
  it("renders module placeholder labels", () => {
    const html = renderToStaticMarkup(
      <AdminShell principal={ownerPrincipal} modules={getVisibleAdminModules(ownerPrincipal)} />
    );

    expect(html).toContain("Active Matters");
    expect(html).toContain("Pending Invoice Approvals");
    expect(html).toContain("Not implemented yet");
    expect(html).toContain("Coming in later phase");
  });

  it("does not claim placeholder cards are implemented functionality", () => {
    const html = renderToStaticMarkup(
      <AdminShell principal={ownerPrincipal} modules={getVisibleAdminModules(ownerPrincipal)} />
    );

    expect(html).not.toContain("Create invoice");
    expect(html).not.toContain("Send statement");
    expect(html).not.toContain("Upload document");
    expect(html).not.toContain("Sync Lexpro");
    expect(html).toContain("No approval, sending, publishing, upload or sync actions exist");
  });

  it("renders the header safely even when a principal has no primary role", () => {
    const html = renderToStaticMarkup(
      <AdminHeader
        principal={{
          userId: "empty",
          email: "empty@example.test",
          roles: [],
          provider: "local_dev_placeholder"
        }}
      />
    );

    expect(html).toContain("Burgess Attorneys Admin");
    expect(html).not.toContain("role-badge");
  });
});
