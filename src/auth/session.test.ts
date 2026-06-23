import { describe, expect, it } from "vitest";

import { createSessionAuthProvider } from "./session";

describe("session auth provider boundary", () => {
  it("maps future provider sessions without requiring production secrets", async () => {
    const provider = createSessionAuthProvider({
      subject: "owner",
      email: "owner@example.test",
      roleKeys: ["OWNER_PRINCIPAL"],
      provider: "future_provider_backed"
    });

    await expect(provider.getCurrentPrincipal()).resolves.toMatchObject({
      userId: "owner",
      roles: ["OWNER_PRINCIPAL"],
      provider: "future_provider_backed"
    });
  });

  it("fails closed for unknown future provider roles", async () => {
    const provider = createSessionAuthProvider({
      subject: "bad-role",
      email: "bad-role@example.test",
      roleKeys: ["UNKNOWN"],
      provider: "future_provider_backed"
    });

    await expect(provider.getCurrentPrincipal()).resolves.toBeNull();
  });
});
