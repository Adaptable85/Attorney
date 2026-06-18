import type {
  BillingLineItemInput,
  ValidatedBillingLineItem
} from "@/domain/billing";
import type { ActorContext, RecordId, RepositoryResult } from "./shared";

export type BillingLineItemRecord = ValidatedBillingLineItem & {
  id: RecordId;
  status: "DRAFT" | "AWAITING_REVIEW" | "APPROVED_FOR_INVOICE" | "REJECTED" | "INVOICED" | "CORRECTED";
  createdAt: Date;
  updatedAt: Date;
};

export type BillingRepository = {
  createDraftLineItem(
    input: BillingLineItemInput,
    actor: ActorContext
  ): RepositoryResult<BillingLineItemRecord>;
  updateDraftLineItem(
    id: RecordId,
    input: Partial<BillingLineItemInput>,
    actor: ActorContext
  ): RepositoryResult<BillingLineItemRecord>;
  markRejected(id: RecordId, actor: ActorContext): RepositoryResult<BillingLineItemRecord>;
  findById(id: RecordId): RepositoryResult<BillingLineItemRecord | null>;
  listDraftsForMatter(matterId: RecordId): RepositoryResult<readonly BillingLineItemRecord[]>;
};

