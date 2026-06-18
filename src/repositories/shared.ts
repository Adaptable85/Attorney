export type RepositoryResult<T> = Promise<T>;

export type RecordId = string;

export type ActorContext = {
  actorId: string;
  reason?: string;
};

export type ListOptions = {
  limit?: number;
  cursor?: string;
};

