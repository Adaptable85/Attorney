import { describe, expect, it } from "vitest";

import { createLocalDevAuthProvider } from "./auth-provider";

describe("auth provider boundary", () => {
  it("keeps local development auth explicit and provider-isolated", async () => {
    const provider = createLocalDevAuthProvider({
      userId: "user_1",
      email: "owner@example.test",
      roles: ["OWNER_PRINCIPAL"],
      provider: "local_dev_placeholder"
    });

    await expect(provider.getCurrentPrincipal()).resolves.toMatchObject({
      email: "owner@example.test",
      roles: ["OWNER_PRINCIPAL"],
      provider: "local_dev_placeholder"
    });
  });

  it("does not pretend an unauthenticated request is secure", async () => {
    const provider = createLocalDevAuthProvider(null);

    await expect(provider.getCurrentPrincipal()).resolves.toBeNull();
  });
});

