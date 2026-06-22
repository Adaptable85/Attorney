import { describe, expect, it } from "vitest";

import type { ClientSummary } from "@/services/clients-service";
import type { MatterSummary } from "@/services/matters-service";
import {
  createClientListItems,
  createMatterDetailItem,
  createMatterListItems
} from "./client-matter-read-model";

const client: ClientSummary = {
  id: "client_demo_001",
  accountNumber: "DEMO-CLIENT-001",
  displayName: "Demo Client A",
  status: "ACTIVE"
};

const matter: MatterSummary = {
  id: "matter_demo_001",
  clientId: "client_demo_001",
  accountNumber: "DEMO-MATTER-001",
  name: "Demo Contract Review",
  description: "Fake matter summary",
  type: "CONTRACTS",
  status: "OPEN",
  nextStepDueDate: new Date("2026-07-03T00:00:00.000Z")
};

describe("client matter read model", () => {
  it("labels client list rows as demo placeholders", () => {
    const items = createClientListItems([client], [matter]);

    expect(items[0]).toMatchObject({
      accountNumber: "DEMO-CLIENT-001",
      displayName: "Demo Client A",
      demoLabel: "Demo placeholder data",
      matterCountLabel: "1 demo matter"
    });
  });

  it("creates matter list rows with required read-only fields", () => {
    const items = createMatterListItems([matter], [client]);

    expect(items[0]).toMatchObject({
      accountNumber: "DEMO-MATTER-001",
      clientDisplayName: "Demo Client A",
      name: "Demo Contract Review",
      typeLabel: "CONTRACTS",
      statusLabel: "OPEN",
      nextStepDueDateLabel: "2026-07-03",
      responsibleUserPlaceholder: "Demo responsible user",
      latestInvoiceStatusPlaceholder: "Demo invoice status: not connected",
      latestStatementBalancePlaceholder: "Demo statement balance: R0.00 placeholder",
      lastCommunicationPlaceholder: "Demo last communication: not connected",
      paymentStatusPlaceholder: "Demo payment status: Lexpro remains source of truth"
    });
  });

  it("creates matter detail rows without active workflow actions", () => {
    const detail = createMatterDetailItem(matter, [client]);

    expect(detail.futureActionsLabel).toBe("Future phase only - no active edit, delete, send or approval actions");
    expect(JSON.stringify(detail)).not.toContain("button");
  });

  it("uses safe placeholder fallbacks for incomplete demo matter metadata", () => {
    const matterWithoutDate = {
      ...matter,
      clientId: "missing_client",
      nextStepDueDate: undefined
    };
    const items = createMatterListItems([matterWithoutDate], []);

    expect(items[0]).toMatchObject({
      clientDisplayName: "Demo client placeholder",
      nextStepDueDateLabel: "Demo due date placeholder"
    });
  });

  it("uses plural matter count labels for multiple demo matters", () => {
    const items = createClientListItems([client], [matter, { ...matter, id: "matter_demo_002" }]);

    expect(items[0]?.matterCountLabel).toBe("2 demo matters");
  });
});
