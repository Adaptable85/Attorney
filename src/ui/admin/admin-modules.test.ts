import { describe, expect, it } from "vitest";

import { getVisibleAdminModules } from "./admin-modules";

describe("admin module visibility", () => {
  it("hides approval items from support admin where policy denies approval", () => {
    const modules = getVisibleAdminModules({
      userId: "support",
      email: "support@example.test",
      roles: ["SUPPORT_ADMIN"],
      provider: "local_dev_placeholder"
    });

    expect(modules.map((module) => module.id)).not.toContain("agent-drafts");
    expect(modules.map((module) => module.navLabel)).not.toContain("Marketing");
    expect(modules.map((module) => module.title)).toContain("Document Review");
    expect(modules.map((module) => module.title)).toContain("Billing Review");
  });

  it("hides all admin items from agent service users", () => {
    const modules = getVisibleAdminModules({
      userId: "agent",
      email: "agent@example.test",
      roles: ["AGENT_SERVICE"],
      provider: "local_dev_placeholder"
    });

    expect(modules).toEqual([]);
  });

  it("shows owner approval and audit placeholders", () => {
    const modules = getVisibleAdminModules({
      userId: "owner",
      email: "owner@example.test",
      roles: ["OWNER_PRINCIPAL"],
      provider: "local_dev_placeholder"
    });

    expect(modules.map((module) => module.title)).toEqual(
      expect.arrayContaining([
        "Billing Review",
        "Audit Trail"
      ])
    );
  });

  it("keeps placeholder modules labelled as not implemented", () => {
    const modules = getVisibleAdminModules({
      userId: "owner",
      email: "owner@example.test",
      roles: ["OWNER_PRINCIPAL"],
      provider: "local_dev_placeholder"
    });

    expect(modules.every((module) => module.status === "Not implemented yet")).toBe(true);
    expect(modules.every((module) => module.phaseLabel === "Coming in later phase")).toBe(true);
  });

  it("uses private admin routes without duplicate navigation targets", () => {
    const modules = getVisibleAdminModules({
      userId: "reviewer",
      email: "reviewer@example.test",
      roles: ["READ_ONLY_REVIEWER"],
      provider: "local_dev_placeholder"
    });

    const hrefs = modules.map((module) => module.href);

    expect(hrefs).toEqual(expect.arrayContaining(["/admin/clients", "/admin/matters", "/admin/documents"]));
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs.every((href) => href.startsWith("/admin"))).toBe(true);
  });
});
