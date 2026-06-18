import type {
  StatementSnapshotInput,
  ValidatedStatementSnapshot
} from "@/domain/statements";
import type { ActorContext, RecordId, RepositoryResult } from "./shared";

export type StatementSnapshotRecord = ValidatedStatementSnapshot & {
  id: RecordId;
  createdAt: Date;
  updatedAt: Date;
};

export type StatementsRepository = {
  createDraftSnapshot(
    input: StatementSnapshotInput,
    actor: ActorContext
  ): RepositoryResult<StatementSnapshotRecord>;
  submitForOwnerApproval(id: RecordId, actor: ActorContext): RepositoryResult<StatementSnapshotRecord>;
  recordOwnerApproval(
    id: RecordId,
    approver: ActorContext
  ): RepositoryResult<StatementSnapshotRecord>;
  markCorrectedByCorrectionRecord(
    id: RecordId,
    correctionRecordId: RecordId,
    actor: ActorContext
  ): RepositoryResult<StatementSnapshotRecord>;
  findById(id: RecordId): RepositoryResult<StatementSnapshotRecord | null>;
};

