import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MatterDetail } from "./matter-detail";

const matter = {
  id: "matter_demo_001",
  accountNumber: "DEMO-MATTER-001",
  clientDisplayName: "Demo Client A",
  name: "Demo Contract Review",
  description: "Fake matter summary",
  typeLabel: "CONTRACTS",
  statusLabel: "OPEN",
  nextStepDueDateLabel: "2026-07-03",
  responsibleUserPlaceholder: "Demo responsible user",
  latestInvoiceStatusPlaceholder: "Demo invoice status: not connected",
  latestStatementBalancePlaceholder: "Demo statement balance: R0.00 placeholder",
  lastCommunicationPlaceholder: "Demo last communication: not connected",
  paymentStatusPlaceholder: "Demo payment status: Lexpro remains source of truth",
  demoLabel: "Demo placeholder data" as const,
  futureActionsLabel: "Future phase only - no active edit, delete, send or approval actions" as const
};

describe("matter detail", () => {
  it("renders required read-only detail fields and future-phase action label", () => {
    const html = renderToStaticMarkup(<MatterDetail matter={matter} />);

    expect(html).toContain("DEMO-MATTER-001");
    expect(html).toContain("Demo Client A");
    expect(html).toContain("Fake matter summary");
    expect(html).toContain("Future phase only");
  });

  it("does not render active buttons", () => {
    const html = renderToStaticMarkup(<MatterDetail matter={matter} />);

    expect(html).not.toContain("<button");
  });
});
