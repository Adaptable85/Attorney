import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ClientList } from "./client-list";

describe("client list", () => {
  it("renders required read-only client fields and demo labels", () => {
    const html = renderToStaticMarkup(
      <ClientList
        clients={[
          {
            id: "client_demo_001",
            accountNumber: "DEMO-CLIENT-001",
            displayName: "Demo Client A",
            statusLabel: "ACTIVE",
            matterCountLabel: "1 demo matter",
            latestStatementBalancePlaceholder: "Demo statement balance: R0.00 placeholder",
            accountingStatusPlaceholder: "Demo accounting status: Lexpro remains source of truth",
            demoLabel: "Demo placeholder data"
          }
        ]}
      />
    );

    expect(html).toContain("DEMO-CLIENT-001");
    expect(html).toContain("Demo Client A");
    expect(html).toContain("Demo placeholder data");
    expect(html).toContain("Lexpro remains source of truth");
  });

  it("does not render active client mutation actions", () => {
    const html = renderToStaticMarkup(<ClientList clients={[]} />);

    expect(html).not.toContain("<button");
    expect(html).not.toContain("Edit client");
    expect(html).not.toContain("Delete client");
    expect(html).not.toContain("Save");
  });
});
