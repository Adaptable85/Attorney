import { describe, expect, it } from "vitest";

import {
  canPerformSensitiveAction,
  invoiceNumberRequiresApproval
} from "./permission-invariants";

describe("permission invariants", () => {
  it("keeps agent and build support users out of approval/send actions", () => {
    expect(canPerformSensitiveAction("openclaw_agent", "approve_invoice")).toBe(false);
    expect(canPerformSensitiveAction("openclaw_agent", "send_statement")).toBe(false);
    expect(canPerformSensitiveAction("build_support", "approve_invoice")).toBe(false);
    expect(canPerformSensitiveAction("build_support", "publish_marketing")).toBe(false);
  });

  it("allows owner/principal control for sensitive actions", () => {
    expect(canPerformSensitiveAction("owner_principal", "approve_invoice")).toBe(true);
    expect(canPerformSensitiveAction("owner_principal", "send_statement")).toBe(true);
  });

  it("rejects unknown sensitive actions defensively at runtime", () => {
    expect(
      canPerformSensitiveAction("owner_principal", "unknown_action" as never)
    ).toBe(false);
  });

  it("documents invoice number assignment as approval-gated", () => {
    expect(invoiceNumberRequiresApproval()).toBe(true);
  });
});
