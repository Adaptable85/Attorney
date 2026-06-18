import { describe, expect, it } from "vitest";

import {
  canAccessDocumentMetadata,
  canCreateDocumentMetadata,
  canDownloadDocument,
  documentAccessRequiresPermissionCheck,
  documentRecordStoresMetadataOnly,
  validateDocumentMetadataInput
} from "./documents";
import { createTimelineEventPayload } from "./timeline";

describe("document metadata and timeline foundation", () => {
  it("defaults document metadata to private", () => {
    const metadata = validateDocumentMetadataInput({
      clientId: "client_1",
      storageKey: "clients/client_1/example.pdf",
      filename: "example.pdf",
      contentType: "application/pdf"
    });

    expect(metadata).toMatchObject({
      visibility: "PRIVATE",
      status: "ACTIVE"
    });
  });

  it("keeps document records metadata-only and permission-checked", () => {
    expect(documentRecordStoresMetadataOnly()).toBe(true);
    expect(documentAccessRequiresPermissionCheck()).toBe(true);
  });

  it("requires permission for document access and download boundaries", () => {
    expect(canAccessDocumentMetadata("OWNER_PRINCIPAL")).toBe(true);
    expect(canAccessDocumentMetadata("SUPPORT_ADMIN")).toBe(true);
    expect(canAccessDocumentMetadata("READ_ONLY_REVIEWER")).toBe(true);
    expect(canAccessDocumentMetadata("AGENT_SERVICE")).toBe(false);

    expect(canDownloadDocument("OWNER_PRINCIPAL")).toBe(true);
    expect(canDownloadDocument("SUPPORT_ADMIN")).toBe(true);
    expect(canDownloadDocument("READ_ONLY_REVIEWER")).toBe(false);
    expect(canDownloadDocument("AGENT_SERVICE")).toBe(false);
  });

  it("allows document metadata creation only for owner/support users", () => {
    expect(canCreateDocumentMetadata("OWNER_PRINCIPAL")).toBe(true);
    expect(canCreateDocumentMetadata("SUPPORT_ADMIN")).toBe(true);
    expect(canCreateDocumentMetadata("READ_ONLY_REVIEWER")).toBe(false);
    expect(canCreateDocumentMetadata("AGENT_SERVICE")).toBe(false);
  });

  it("creates timeline event payloads with actor, subject and event type", () => {
    const event = createTimelineEventPayload({
      eventType: "MATTER_CREATED",
      actorId: "user_1",
      subjectType: "matter",
      subjectId: "matter_1",
      clientId: "client_1",
      summary: "Matter created"
    });

    expect(event).toMatchObject({
      eventType: "MATTER_CREATED",
      actorId: "user_1",
      subjectType: "matter",
      subjectId: "matter_1"
    });
  });
});

