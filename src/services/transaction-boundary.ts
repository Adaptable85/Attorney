export type TransactionWork<T, TScope = void> = (scope: TScope) => Promise<T>;

export type TransactionBoundary<TScope = void> = {
  execute<T>(work: TransactionWork<T, TScope>): Promise<T>;
};

export const immediateTransactionBoundary: TransactionBoundary = {
  async execute(work) {
    return work(undefined);
  }
};

export type FakeTransactionBoundary = TransactionBoundary & {
  readonly events: readonly string[];
};

export function createFakeTransactionBoundary(options?: {
  failBeforeWork?: boolean;
  failAfterWork?: boolean;
}): FakeTransactionBoundary {
  const events: string[] = [];

  return {
    get events() {
      return events;
    },

    async execute(work) {
      events.push("begin");

      if (options?.failBeforeWork) {
        events.push("rollback");
        throw new Error("transaction begin failed");
      }

      try {
        const result = await work(undefined);

        if (options?.failAfterWork) {
          events.push("rollback");
          throw new Error("transaction commit failed");
        }

        events.push("commit");
        return result;
      } catch (error) {
        if (events.at(-1) !== "rollback") {
          events.push("rollback");
        }

        throw error;
      }
    }
  };
}
