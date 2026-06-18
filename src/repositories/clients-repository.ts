import type { CreateClientInput, ValidatedClientInput } from "@/domain/clients";
import type { ActorContext, ListOptions, RecordId, RepositoryResult } from "./shared";

export type ClientRecord = ValidatedClientInput & {
  id: RecordId;
  createdAt: Date;
  updatedAt: Date;
};

export type ClientsRepository = {
  create(input: CreateClientInput, actor: ActorContext): RepositoryResult<ClientRecord>;
  updateDraftableFields(
    id: RecordId,
    input: Partial<CreateClientInput>,
    actor: ActorContext
  ): RepositoryResult<ClientRecord>;
  archive(id: RecordId, actor: ActorContext): RepositoryResult<ClientRecord>;
  findById(id: RecordId): RepositoryResult<ClientRecord | null>;
  listOpen(options?: ListOptions): RepositoryResult<readonly ClientRecord[]>;
};

