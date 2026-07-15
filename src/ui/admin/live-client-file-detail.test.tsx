import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LiveClientFileDetail } from "./live-client-file-detail";

describe("live client file detail", () => {
  const client = {
    id: "client_test_1",
    accountNumber: "TEST-001",
    displayName: "TEST Client File - Delete Later",
    status: "ACTIVE" as const,
    updatedAt: new Date("2026-07-15T09:00:00.000Z"),
    primaryContactName: "Test Contact",
    primaryContactEmail: "test@example.test",
    primaryContactPhone: "+27 00 000 0000"
  };

  it("renders saved staging client details with inactive workflow panels", () => {
    const html = renderToStaticMarkup(<LiveClientFileDetail client={client} />);

    expect(html).toContain("Live staging client file");
    expect(html).toContain("TEST Client File - Delete Later");
    expect(html).toContain("TEST-001");
    expect(html).toContain("Test Contact");
    expect(html).toContain("Matter creation unavailable");
    expect(html).toContain("Document upload unavailable");
    expect(html).toContain("LLM note processing unavailable");
    expect(html).toContain("Invoice approval unavailable");
    expect(html).toContain("Statement sending unavailable");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
  });

  it("renders pending contact details when a saved client has no primary contact", () => {
    const html = renderToStaticMarkup(
      <LiveClientFileDetail
        client={{
          ...client,
          primaryContactName: null,
          primaryContactEmail: null,
          primaryContactPhone: null
        }}
      />
    );

    expect(html).toContain("No contact saved");
    expect(html).toContain("No email saved");
    expect(html).toContain("No phone saved");
  });
});
