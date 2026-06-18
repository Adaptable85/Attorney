import type { CreateMatterInput, ValidatedMatterInput } from "@/domain/matters";
import type { ActorContext, ListOptions, RecordId, RepositoryResult } from "./shared";

export type MatterRecord = ValidatedMatterInput & {
  id: RecordId;
  createdAt: Date;
  updatedAt: Date;
};

export type MattersRepository = {
  create(input: CreateMatterInput, actor: ActorContext): RepositoryResult<MatterRecord>;
  updateOperationalFields(
    id: RecordId,
    input: Partial<CreateMatterInput>,
    actor: ActorContext
  ): RepositoryResult<MatterRecord>;
  archive(id: RecordId, actor: ActorContext): RepositoryResult<MatterRecord>;
  findById(id: RecordId): RepositoryResult<MatterRecord | null>;
  listOpen(options?: ListOptions): RepositoryResult<readonly MatterRecord[]>;
};

