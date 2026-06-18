import type { AuditEventInput } from "@/audit/audit-service";
import type { RepositoryResult, RecordId } from "./shared";

export type StoredAuditEvent = AuditEventInput & {
  id: RecordId;
  sensitive: boolean;
  createdAt: Date;
};

export type AuditRepository = {
  record(event: AuditEventInput): RepositoryResult<StoredAuditEvent>;
  findByTarget(targetType: string, targetId: RecordId): RepositoryResult<readonly StoredAuditEvent[]>;
};

