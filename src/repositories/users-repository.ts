import type { RepositoryResult, RecordId } from "./shared";
import type { RoleKey } from "@/domain/roles";

export type UserRecord = {
  id: RecordId;
  email: string;
  name: string;
  roles: readonly RoleKey[];
};

export type UsersRepository = {
  findById(id: RecordId): RepositoryResult<UserRecord | null>;
  findByEmail(email: string): RepositoryResult<UserRecord | null>;
  listByRole(role: RoleKey): RepositoryResult<readonly UserRecord[]>;
};

