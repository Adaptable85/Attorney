import { describe, expect, it } from "vitest";

import {
  fakeApprovedInvoice,
  fakeBillingLineItem,
  fakeClient,
  fakeDraftInvoice,
  fakeMatter,
  fakeStatementSnapshot,
  fakeUsers
} from ".";

describe("deterministic fake fixtures", () => {
  it("contains all four day-one roles", () => {
    const roles = Object.values(fakeUsers).flatMap((user) => user.roles);

    expect(roles).toEqual(
      expect.arrayContaining([
        "OWNER_PRINCIPAL",
        "SUPPORT_ADMIN",
        "AGENT_SERVICE",
        "READ_ONLY_REVIEWER"
      ])
    );
  });

  it("uses obvious fake non-client data", () => {
    const serialized = JSON.stringify({
      fakeUsers,
      fakeClient,
      fakeMatter
    }).toLowerCase();

    expect(serialized).toContain("demo");
    expect(serialized).toContain("example");
    expect(serialized).not.toContain("burgess");
    expect(serialized).not.toContain("wesley");
  });

  it("uses integer cents only for fake financial records", () => {
    const moneyValues = [
      fakeBillingLineItem.unitAmountCents,
      fakeBillingLineItem.totalAmountCents,
      fakeDraftInvoice.subtotalCents,
      fakeDraftInvoice.totalCents,
      fakeApprovedInvoice.totalCents,
      fakeStatementSnapshot.closingBalanceCents
    ];

    for (const value of moneyValues) {
      expect(Number.isInteger(value)).toBe(true);
    }
  });
});

