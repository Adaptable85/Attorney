import type { FinancialCorrectionInput } from "@/domain/financial-corrections";
import type { ActorContext, RecordId, RepositoryResult } from "./shared";

export type FinancialCorrectionRecord = Omit<FinancialCorrectionInput, "actorRole"> & {
  id: RecordId;
  createdAt: Date;
};

export type FinancialCorrectionsRepository = {
  createCorrection(
    input: FinancialCorrectionInput,
    actor: ActorContext
  ): RepositoryResult<FinancialCorrectionRecord>;
  findByTarget(
    targetRecordType: string,
    targetRecordId: RecordId
  ): RepositoryResult<readonly FinancialCorrectionRecord[]>;
};

