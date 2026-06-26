import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MatterList } from "./matter-list";

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
  accountingStatusPlaceholder: "Demo accounting status: Lexpro remains source of truth",
  demoLabel: "Demo placeholder data" as const
};

describe("matter list", () => {
  it("renders required read-only matter fields", () => {
    const html = renderToStaticMarkup(<MatterList matters={[matter]} />);

    expect(html).toContain("DEMO-MATTER-001");
    expect(html).toContain("Demo Client A");
    expect(html).toContain("Demo Contract Review");
    expect(html).toContain("CONTRACTS");
    expect(html).toContain("OPEN");
    expect(html).toContain("2026-07-03");
    expect(html).toContain("Demo responsible user");
    expect(html).toContain("Demo invoice status: not connected");
    expect(html).toContain("Demo statement balance: R0.00 placeholder");
    expect(html).toContain("Demo last communication: not connected");
    expect(html).toContain("Demo accounting status: Lexpro remains source of truth");
  });

  it("does not render active matter workflow actions", () => {
    const html = renderToStaticMarkup(<MatterList matters={[matter]} />);

    expect(html).not.toContain("<button");
    expect(html).not.toContain("Edit matter");
    expect(html).not.toContain("Delete matter");
    expect(html).not.toContain("Send statement");
    expect(html).not.toContain("Approve invoice");
    expect(html).not.toContain("Save");
  });
});
