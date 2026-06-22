import { describe, expect, it } from "vitest";

import {
  getAdminDashboardModel,
  getVisibleDashboardSections,
  hasDashboardAccess
} from "./admin-dashboard";

const ownerPrincipal = {
  userId: "owner",
  email: "owner@example.test",
  roles: ["OWNER_PRINCIPAL" as const],
  provider: "local_dev_placeholder" as const
};

const supportPrincipal = {
  userId: "support",
  email: "support@example.test",
  roles: ["SUPPORT_ADMIN" as const],
  provider: "local_dev_placeholder" as const
};

const agentPrincipal = {
  userId: "agent",
  email: "agent@example.test",
  roles: ["AGENT_SERVICE" as const],
  provider: "local_dev_placeholder" as const
};

describe("admin dashboard model", () => {
  it("uses clearly fake demo labels and no real Burgess client names", () => {
    const dashboard = getAdminDashboardModel(ownerPrincipal);
    const serialized = JSON.stringify(dashboard);

    expect(serialized).toContain("Demo");
    expect(serialized).not.toContain("Wesley");
    expect(serialized).not.toContain("Cyrus");
    expect(serialized).not.toContain("real client");
  });

  it("shows owner-only pending approval placeholders to owner/principal users", () => {
    const sections = getVisibleDashboardSections(ownerPrincipal);

    expect(sections.map((section) => section.id)).toContain("pending-approval-placeholders");
  });

  it("does not expose owner-only approval placeholders to support admins", () => {
    const sections = getVisibleDashboardSections(supportPrincipal);

    expect(sections.map((section) => section.id)).not.toContain("pending-approval-placeholders");
    expect(sections.map((section) => section.id)).toContain("preparation-placeholders");
  });

  it("blocks agent service users from the dashboard model", () => {
    expect(hasDashboardAccess(agentPrincipal)).toBe(false);
    expect(getVisibleDashboardSections(agentPrincipal)).toEqual([]);
  });

  it("does not expose send, publish or approval actions", () => {
    const dashboard = getAdminDashboardModel(ownerPrincipal);

    expect(dashboard.sections.every((section) => section.actions.length === 0)).toBe(true);
    expect(JSON.stringify(dashboard)).not.toContain("Send button");
    expect(JSON.stringify(dashboard)).not.toContain("Approve button");
    expect(JSON.stringify(dashboard)).not.toContain("Publish button");
  });

  it("includes the Lexpro accounting boundary reminder", () => {
    const dashboard = getAdminDashboardModel(ownerPrincipal);

    expect(JSON.stringify(dashboard)).toContain("Lexpro remains the accounting source of truth");
  });
});
