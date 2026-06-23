import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";
import {
  type OAuthProviderMarker,
  type OAuthStatePayload,
  validateOAuthStatePayload
} from "./oauth-state";

export type OAuthStateStore = {
  store(record: OAuthStatePayload): Promise<ServiceResult<void>>;
  consume(state: string, options?: {
    expectedProvider?: OAuthProviderMarker;
    now?: Date;
  }): Promise<ServiceResult<OAuthStatePayload>>;
  expire(now?: Date): Promise<number>;
};

export function createInMemoryOAuthStateStore(initialRecords?: readonly OAuthStatePayload[]): OAuthStateStore {
  const records = new Map<string, OAuthStatePayload>();

  for (const record of initialRecords ?? []) {
    records.set(record.state, record);
  }

  return {
    async store(record) {
      const validation = validateOAuthStatePayload(record, {
        expectedProvider: record.provider,
        now: record.issuedAt
      });

      if (!validation.ok) {
        return validation;
      }

      records.set(record.state, record);

      return serviceSuccess(undefined);
    },
    async consume(state, options) {
      const record = records.get(state);

      if (!record) {
        return serviceFailure({
          code: "SERVICE_CONTEXT_ERROR",
          message: "OAuth state record was not found."
        });
      }

      const validation = validateOAuthStatePayload(record, {
        expectedProvider: options?.expectedProvider,
        now: options?.now
      });

      if (!validation.ok) {
        records.delete(state);
        return validation;
      }

      records.delete(state);

      return validation;
    },
    async expire(now = new Date()) {
      let expiredCount = 0;

      for (const [state, record] of records.entries()) {
        if (record.expiresAt <= now) {
          records.delete(state);
          expiredCount += 1;
        }
      }

      return expiredCount;
    }
  };
}

