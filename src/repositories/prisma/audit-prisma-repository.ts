import {
  createAuditEvent,
  type AuditEvent,
  type AuditEventInput
} from "@/audit/audit-service";
import type { AuditRepository, StoredAuditEvent } from "@/repositories/audit-repository";

type PrismaAuditEventType =
  | "LOGIN"
  | "FAILED_LOGIN"
  | "PERMISSION_CHANGE"
  | "CLIENT_CREATED"
  | "CLIENT_EDITED"
  | "CLIENT_RECORD_ACCESSED"
  | "MATTER_CREATED"
  | "MATTER_EDITED"
  | "MATTER_RECORD_ACCESSED"
  | "MATTER_NOTE_ADDED"
  | "DOCUMENT_ACCESSED"
  | "DRAFT_CREATED"
  | "BILLING_LINE_ITEM_CREATED"
  | "BILLING_LINE_ITEM_EDITED"
  | "INVOICE_CREATED"
  | "INVOICE_SUBMITTED_FOR_APPROVAL"
  | "INVOICE_APPROVED"
  | "INVOICE_NUMBER_ASSIGNED"
  | "INVOICE_SENT"
  | "INVOICE_CANCELLED"
  | "INVOICE_CORRECTED"
  | "STATEMENT_SNAPSHOT_CREATED"
  | "STATEMENT_SUBMITTED_FOR_APPROVAL"
  | "STATEMENT_APPROVED"
  | "STATEMENT_SENT"
  | "STATEMENT_CORRECTED"
  | "PAYMENT_IMPORT_CHANGED"
  | "FINANCIAL_CORRECTION_CREATED"
  | "VAT_TREATMENT_OVERRIDDEN"
  | "AGENT_ACTION"
  | "DOCUMENT_METADATA_CREATED"
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_DOWNLOADED"
  | "TIMELINE_EVENT_CREATED"
  | "MARKETING_APPROVED"
  | "OUTREACH_APPROVED";

type PrismaAuditLogRecord = {
  id: string;
  eventType: PrismaAuditEventType;
  actorId: string | null;
  targetType: string | null;
  targetId: string | null;
  summary: string;
  metadata: unknown;
  sensitive: boolean;
  createdAt: Date;
};

type PrismaAuditClient = {
  auditLog: {
    create(args: {
      data: {
        eventType: PrismaAuditEventType;
        actorId?: string;
        targetType?: string;
        targetId?: string;
        summary: string;
        metadata?: Record<string, unknown>;
        sensitive: boolean;
        createdAt?: Date;
      };
    }): Promise<PrismaAuditLogRecord>;
    findMany(args: {
      where: {
        targetType: string;
        targetId: string;
      };
      orderBy: {
        createdAt: "desc";
      };
    }): Promise<PrismaAuditLogRecord[]>;
  };
};

function toPrismaEventType(eventType: AuditEventInput["eventType"]): PrismaAuditEventType {
  return eventType.toUpperCase() as PrismaAuditEventType;
}

function fromPrismaEventType(eventType: PrismaAuditEventType): AuditEventInput["eventType"] {
  return eventType.toLowerCase() as AuditEventInput["eventType"];
}

function safeMetadata(metadata: unknown): Record<string, unknown> | undefined {
  return metadata && typeof metadata === "object" && !Array.isArray(metadata)
    ? (metadata as Record<string, unknown>)
    : undefined;
}

function mapAuditLog(record: PrismaAuditLogRecord): StoredAuditEvent {
  return {
    id: record.id,
    eventType: fromPrismaEventType(record.eventType),
    ...(record.actorId ? { actorId: record.actorId } : {}),
    ...(record.targetType ? { targetType: record.targetType } : {}),
    ...(record.targetId ? { targetId: record.targetId } : {}),
    summary: record.summary,
    ...(safeMetadata(record.metadata) ? { metadata: safeMetadata(record.metadata) } : {}),
    sensitive: record.sensitive,
    createdAt: record.createdAt
  };
}

export function createPrismaAuditRepository(prisma: PrismaAuditClient): AuditRepository {
  return {
    async record(input) {
      const event = "sensitive" in input ? (input as AuditEvent) : createAuditEvent(input);
      const record = await prisma.auditLog.create({
        data: {
          eventType: toPrismaEventType(event.eventType),
          ...(event.actorId ? { actorId: event.actorId } : {}),
          ...(event.targetType ? { targetType: event.targetType } : {}),
          ...(event.targetId ? { targetId: event.targetId } : {}),
          summary: event.summary,
          ...(event.metadata ? { metadata: event.metadata } : {}),
          sensitive: event.sensitive,
          createdAt: event.occurredAt
        }
      });

      return mapAuditLog(record);
    },

    async findByTarget(targetType, targetId) {
      const records = await prisma.auditLog.findMany({
        where: {
          targetType,
          targetId
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      return records.map(mapAuditLog);
    }
  };
}

export function createAuditWriterFromRepository(repository: AuditRepository) {
  return {
    async record(event: AuditEvent) {
      await repository.record(event);
    }
  };
}
