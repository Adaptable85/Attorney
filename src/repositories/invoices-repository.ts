import type {
  DraftInvoiceInput,
  InvoiceApprovalInput,
  ValidatedDraftInvoice
} from "@/domain/invoices";
import type { ActorContext, RecordId, RepositoryResult } from "./shared";

export type InvoiceRecord = ValidatedDraftInvoice & {
  id: RecordId;
  officialInvoiceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InvoicesRepository = {
  createDraft(input: DraftInvoiceInput, actor: ActorContext): RepositoryResult<InvoiceRecord>;
  updateDraftOnly(
    id: RecordId,
    input: Partial<DraftInvoiceInput>,
    actor: ActorContext
  ): RepositoryResult<InvoiceRecord>;
  submitForOwnerApproval(id: RecordId, actor: ActorContext): RepositoryResult<InvoiceRecord>;
  recordOwnerApproval(input: InvoiceApprovalInput): RepositoryResult<InvoiceRecord>;
  markCorrectedByCorrectionRecord(
    id: RecordId,
    correctionRecordId: RecordId,
    actor: ActorContext
  ): RepositoryResult<InvoiceRecord>;
  findById(id: RecordId): RepositoryResult<InvoiceRecord | null>;
};

