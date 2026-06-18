import { isSensitiveAuditEvent, type AuditEventType } from "./audit-events";

export type AuditEventInput = {
  eventType: AuditEventType;
  actorId?: string;
  targetType?: string;
  targetId?: string;
  summary: string;
  metadata?: Record<string, unknown>;
};

export type AuditEvent = AuditEventInput & {
  sensitive: boolean;
  occurredAt: Date;
};

export type AuditEventWriter = {
  record(event: AuditEvent): Promise<void>;
};

export function createAuditEvent(input: AuditEventInput, occurredAt = new Date()): AuditEvent {
  return {
    ...input,
    sensitive: isSensitiveAuditEvent(input.eventType),
    occurredAt
  };
}

export async function recordAuditEvent(
  writer: AuditEventWriter,
  input: AuditEventInput,
  occurredAt = new Date()
): Promise<AuditEvent> {
  const event = createAuditEvent(input, occurredAt);
  await writer.record(event);
  return event;
}

