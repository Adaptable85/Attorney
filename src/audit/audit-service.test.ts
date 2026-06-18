import { describe, expect, it, vi } from "vitest";

import { AUDIT_EVENT_TYPES, isSensitiveAuditEvent } from "./audit-events";
import { createAuditEvent, recordAuditEvent } from "./audit-service";

describe("audit event boundary", () => {
  it("represents required audit event categories", () => {
    expect(AUDIT_EVENT_TYPES).toEqual(
      expect.arrayContaining([
        "login",
        "failed_login",
        "permission_change",
        "client_created",
        "client_edited",
        "client_record_accessed",
        "matter_created",
        "matter_edited",
        "matter_record_accessed",
        "matter_note_added",
        "document_accessed",
        "draft_created",
        "invoice_approved",
        "invoice_sent",
        "statement_approved",
        "statement_sent",
        "payment_import_changed",
        "agent_action",
        "document_metadata_created",
        "document_uploaded",
        "document_downloaded",
        "timeline_event_created",
        "marketing_approved",
        "outreach_approved"
      ])
    );
  });

  it("treats approval, send, permission-change and agent-action events as sensitive", () => {
    expect(isSensitiveAuditEvent("invoice_approved")).toBe(true);
    expect(isSensitiveAuditEvent("invoice_sent")).toBe(true);
    expect(isSensitiveAuditEvent("statement_approved")).toBe(true);
    expect(isSensitiveAuditEvent("statement_sent")).toBe(true);
    expect(isSensitiveAuditEvent("permission_change")).toBe(true);
    expect(isSensitiveAuditEvent("agent_action")).toBe(true);
    expect(isSensitiveAuditEvent("client_created")).toBe(true);
    expect(isSensitiveAuditEvent("matter_edited")).toBe(true);
    expect(isSensitiveAuditEvent("document_metadata_created")).toBe(true);
    expect(isSensitiveAuditEvent("timeline_event_created")).toBe(true);
  });

  it("creates audit events without coupling to a database implementation", () => {
    const occurredAt = new Date("2026-06-18T10:00:00.000Z");
    const event = createAuditEvent(
      {
        eventType: "permission_change",
        actorId: "user_1",
        targetType: "role",
        targetId: "role_1",
        summary: "Changed role permission"
      },
      occurredAt
    );

    expect(event).toMatchObject({
      eventType: "permission_change",
      actorId: "user_1",
      sensitive: true,
      occurredAt
    });
  });

  it("records audit events through an injected writer boundary", async () => {
    const writer = { record: vi.fn(async () => undefined) };

    const event = await recordAuditEvent(writer, {
      eventType: "agent_action",
      actorId: "agent_1",
      summary: "Agent created draft suggestion"
    });

    expect(writer.record).toHaveBeenCalledWith(event);
    expect(event.sensitive).toBe(true);
  });
});
