import { describe, expect, it } from "vitest";

import { createLocalDevAuthProvider } from "./auth-provider";
import { requireAdminUser } from "./require-admin-user";

describe("require admin user", () => {
  it("returns owner and support admin users", async () => {
    await expect(
      requireAdminUser(
        createLocalDevAuthProvider({
          userId: "owner",
          email: "owner@example.test",
          roles: ["OWNER_PRINCIPAL"],
          provider: "local_dev_placeholder"
        })
      )
    ).resolves.toMatchObject({ ok: true, principal: { roles: ["OWNER_PRINCIPAL"] } });

    await expect(
      requireAdminUser(
        createLocalDevAuthProvider({
          userId: "support",
          email: "support@example.test",
          roles: ["SUPPORT_ADMIN"],
          provider: "local_dev_placeholder"
        })
      )
    ).resolves.toMatchObject({ ok: true, principal: { roles: ["SUPPORT_ADMIN"] } });
  });

  it("fails closed for missing users and agent service users", async () => {
    await expect(requireAdminUser(createLocalDevAuthProvider(null))).resolves.toMatchObject({
      ok: false,
      reason: "missing_user"
    });
    await expect(
      requireAdminUser(
        createLocalDevAuthProvider({
          userId: "agent",
          email: "agent@example.test",
          roles: ["AGENT_SERVICE"],
          provider: "local_dev_placeholder"
        })
      )
    ).resolves.toMatchObject({ ok: false, reason: "agent_service_blocked" });
  });
});
