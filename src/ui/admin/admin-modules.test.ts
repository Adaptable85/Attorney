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

    expect(modules.map((module) => module.title)).not.toContain("Pending Invoice Approvals");
    expect(modules.map((module) => module.title)).not.toContain("Pending Statement Approvals");
    expect(modules.map((module) => module.title)).toContain("Document Review");
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
        "Pending Invoice Approvals",
        "Pending Statement Approvals",
        "Audit Log"
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
});
