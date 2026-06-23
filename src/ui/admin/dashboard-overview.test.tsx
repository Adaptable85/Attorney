import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getAdminDashboardModel } from "@/domain/admin-dashboard";
import { DashboardOverview } from "./dashboard-overview";

const ownerPrincipal = {
  userId: "owner",
  email: "owner@example.test",
  roles: ["OWNER_PRINCIPAL" as const],
  provider: "local_dev_placeholder" as const
};

describe("dashboard overview", () => {
  it("renders read-only demo dashboard sections", () => {
    const html = renderToStaticMarkup(
      <DashboardOverview dashboard={getAdminDashboardModel(ownerPrincipal)} />
    );

    expect(html).toContain("Read-only admin dashboard");
    expect(html).toContain("Demo placeholder data only");
    expect(html).toContain("Open Matter Visibility");
    expect(html).toContain("Lexpro remains the accounting source of truth");
  });

  it("does not render active workflow controls", () => {
    const html = renderToStaticMarkup(
      <DashboardOverview dashboard={getAdminDashboardModel(ownerPrincipal)} />
    );

    expect(html).not.toContain("<button");
    expect(html).not.toContain("Create client");
    expect(html).not.toContain("Edit matter");
    expect(html).not.toContain("Send statement");
    expect(html).not.toContain("Publish");
  });
});
