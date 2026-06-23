import { describe, expect, it } from "vitest";

import { mapSessionToPrincipal } from "./role-mapping";

describe("role mapping", () => {
  it("maps owner, support, agent and read-only sessions to domain roles", () => {
    expect(
      mapSessionToPrincipal({
        subject: "owner",
        email: "owner@example.test",
        roleKeys: ["OWNER_PRINCIPAL"],
        provider: "future_provider_backed"
      })
    ).toMatchObject({ roles: ["OWNER_PRINCIPAL"] });
    expect(
      mapSessionToPrincipal({
        subject: "support",
        email: "support@example.test",
        roleKeys: ["SUPPORT_ADMIN"],
        provider: "future_provider_backed"
      })
    ).toMatchObject({ roles: ["SUPPORT_ADMIN"] });
    expect(
      mapSessionToPrincipal({
        subject: "agent",
        email: "agent@example.test",
        roleKeys: ["AGENT_SERVICE"],
        provider: "future_provider_backed"
      })
    ).toMatchObject({ roles: ["AGENT_SERVICE"] });
    expect(
      mapSessionToPrincipal({
        subject: "reviewer",
        email: "reviewer@example.test",
        roleKeys: ["READ_ONLY_REVIEWER"],
        provider: "future_provider_backed"
      })
    ).toMatchObject({ roles: ["READ_ONLY_REVIEWER"] });
  });

  it("fails closed for missing users, missing roles and unknown roles", () => {
    expect(mapSessionToPrincipal(null)).toBeNull();
    expect(
      mapSessionToPrincipal({
        subject: "empty",
        email: "empty@example.test",
        roleKeys: [],
        provider: "future_provider_backed"
      })
    ).toBeNull();
    expect(
      mapSessionToPrincipal({
        subject: "unknown",
        email: "unknown@example.test",
        roleKeys: ["OWNER_PRINCIPAL", "UNSUPPORTED_ROLE"],
        provider: "future_provider_backed"
      })
    ).toBeNull();
  });
});
