import type { TimelineEventInput, TimelineEventPayload } from "@/domain/timeline";
import type { RecordId, RepositoryResult } from "./shared";

export type TimelineEventRecord = TimelineEventPayload & {
  id: RecordId;
  createdAt: Date;
};

export type TimelineRepository = {
  record(input: TimelineEventInput): RepositoryResult<TimelineEventRecord>;
  listForSubject(subjectType: string, subjectId: RecordId): RepositoryResult<readonly TimelineEventRecord[]>;
};

