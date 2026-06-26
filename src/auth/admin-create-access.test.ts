import { describe, expect, it } from "vitest";

import { canAccessClientMatterCreateForms } from "./admin-create-access";

describe("admin create form access", () => {
  it("allows owner and support admin users to view disabled create form foundations", () => {
    expect(
      canAccessClientMatterCreateForms({
        userId: "owner",
        email: "owner@example.test",
        roles: ["OWNER_PRINCIPAL"],
        provider: "local_dev_placeholder"
      })
    ).toBe(true);
    expect(
      canAccessClientMatterCreateForms({
        userId: "support",
        email: "support@example.test",
        roles: ["SUPPORT_ADMIN"],
        provider: "local_dev_placeholder"
      })
    ).toBe(true);
  });

  it("blocks read-only reviewer, agent service and missing users", () => {
    expect(
      canAccessClientMatterCreateForms({
        userId: "reviewer",
        email: "reviewer@example.test",
        roles: ["READ_ONLY_REVIEWER"],
        provider: "staging_admin_password"
      })
    ).toBe(false);
    expect(
      canAccessClientMatterCreateForms({
        userId: "agent",
        email: "agent@example.test",
        roles: ["AGENT_SERVICE"],
        provider: "local_dev_placeholder"
      })
    ).toBe(false);
    expect(canAccessClientMatterCreateForms(null)).toBe(false);
  });
});
