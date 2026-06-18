import type {
  DocumentMetadataInput,
  ValidatedDocumentMetadata
} from "@/domain/documents";
import type { ActorContext, RecordId, RepositoryResult } from "./shared";

export type DocumentMetadataRecord = ValidatedDocumentMetadata & {
  id: RecordId;
  createdAt: Date;
  updatedAt: Date;
};

export type DocumentsRepository = {
  createMetadata(
    input: DocumentMetadataInput,
    actor: ActorContext
  ): RepositoryResult<DocumentMetadataRecord>;
  archiveMetadata(id: RecordId, actor: ActorContext): RepositoryResult<DocumentMetadataRecord>;
  findMetadataById(id: RecordId): RepositoryResult<DocumentMetadataRecord | null>;
  listMetadataForMatter(matterId: RecordId): RepositoryResult<readonly DocumentMetadataRecord[]>;
};

