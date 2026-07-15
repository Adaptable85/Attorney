import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { StagingMatterDetail } from "./staging-matter-detail";

const baseMatter = {
  id: "matter_1",
  clientId: "client_1",
  clientDisplayName: "TEST Client File - Delete Later",
  accountNumber: "TEST-MATTER-001",
  name: "TEST Matter - Delete Later",
  description: "Staging test matter",
  type: "OTHER" as const,
  status: "OPEN" as const,
  nextStepDueDate: new Date("2026-07-30T00:00:00.000Z"),
  updatedAt: new Date("2026-07-15T09:00:00.000Z")
};

describe("staging matter detail", () => {
  it("renders a staging matter workspace with document and timeline controls", () => {
    const html = renderToStaticMarkup(
      <StagingMatterDetail
        matter={baseMatter}
        documents={[{
          id: "document_1",
          filename: "TEST_Matter_File.pdf",
          documentType: "Saved matter document",
          matterReference: null,
          documentDate: null,
          contentType: "application/pdf",
          sizeBytes: 2048,
          status: "ACTIVE",
          createdAt: new Date("2026-07-15T09:00:00.000Z")
        }]}
        timeline={[{
          id: "timeline_1",
          eventType: "MATTER_NOTE_ADDED",
          subjectType: "matter_note",
          subjectId: "note_1",
          summary: "Consultation held",
          metadata: {
            eventDate: "2026-07-15",
            body: "Client gave test instructions."
          },
          createdAt: new Date("2026-07-15T10:00:00.000Z")
        }]}
        documentUploadsEnabled={true}
        matterWritesEnabled={true}
        documentUploaded={true}
        timelineAdded={true}
      />
    );

    expect(html).toContain("Live staging matter");
    expect(html).toContain("TEST Matter - Delete Later");
    expect(html).toContain("/admin/clients/client_1");
    expect(html).toContain("2026-07-30");
    expect(html).toContain("Staging matter document upload form");
    expect(html).toContain("Upload Matter Document");
    expect(html).toContain("TEST_Matter_File.pdf");
    expect(html).toContain("/admin/matters/matter_1/documents/document_1/view");
    expect(html).toContain("/admin/matters/matter_1/documents/document_1/download");
    expect(html).toContain("Staging legal timeline form");
    expect(html).toContain("Add Timeline Note");
    expect(html).toContain("Consultation held");
    expect(html).toContain("Edit matter unavailable");
    expect(html).toContain("Close matter unavailable");
    expect(html).toContain("Statement sending unavailable");
    expect(html).not.toContain("Approve invoice");
    expect(html).not.toContain("Send statement");
  });

  it("renders safe fallbacks for missing optional matter fields", () => {
    const html = renderToStaticMarkup(
      <StagingMatterDetail
        matter={{
          ...baseMatter,
          clientDisplayName: null,
          nextStepDueDate: null,
        }}
        documents={[]}
        timeline={[]}
        documentUploadsEnabled={false}
        matterWritesEnabled={false}
        documentError="Document gate test error"
        timelineError="Timeline gate test error"
      />
    );

    expect(html).toContain("Saved client");
    expect(html).toContain("Not set");
    expect(html).toContain("Document upload unavailable");
    expect(html).toContain("Legal timeline unavailable");
    expect(html).toContain("Document gate test error");
    expect(html).toContain("Timeline gate test error");
  });

  it("renders matter document and timeline fallback values", () => {
    const html = renderToStaticMarkup(
      <StagingMatterDetail
        matter={baseMatter}
        documents={[{
          id: "document_1",
          filename: "Tiny.txt",
          documentType: "Saved matter document",
          matterReference: null,
          documentDate: null,
          contentType: "text/plain",
          sizeBytes: 512,
          status: "ACTIVE",
          createdAt: new Date("2026-07-15T09:00:00.000Z")
        }, {
          id: "document_2",
          filename: "Unknown-size.txt",
          documentType: "Saved matter document",
          matterReference: null,
          documentDate: null,
          contentType: "text/plain",
          sizeBytes: null,
          status: "ACTIVE",
          createdAt: new Date("2026-07-16T09:00:00.000Z")
        }]}
        timeline={[{
          id: "timeline_1",
          eventType: "DOCUMENT_UPLOADED",
          subjectType: "document",
          subjectId: "document_1",
          summary: "Uploaded matter document",
          metadata: null,
          createdAt: new Date("2026-07-15T10:00:00.000Z")
        }, {
          id: "timeline_2",
          eventType: "MATTER_NOTE_ADDED",
          subjectType: "matter_note",
          subjectId: "note_1",
          summary: "Empty metadata note",
          metadata: {
            eventDate: "",
            body: ""
          },
          createdAt: new Date("2026-07-16T10:00:00.000Z")
        }]}
        documentUploadsEnabled={true}
        matterWritesEnabled={true}
      />
    );

    expect(html).toContain("512 bytes");
    expect(html).toContain("Unknown");
    expect(html).toContain("2026-07-15");
    expect(html).toContain("2026-07-16");
    expect(html).toContain("document uploaded");
  });
});
