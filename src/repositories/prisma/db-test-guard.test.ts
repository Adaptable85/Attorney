import { afterEach, describe, expect, it, vi } from "vitest";

import { isSafeLocalDatabaseUrl, requireSafeLocalDatabaseUrl } from "./db-test-guard";

describe("DB test guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows only local burgess_attorneys_dev database URLs", () => {
    expect(
      isSafeLocalDatabaseUrl("postgresql://wesleyduplessis@localhost:5432/burgess_attorneys_dev")
    ).toBe(true);
    expect(
      isSafeLocalDatabaseUrl("postgresql://user:password@127.0.0.1:5432/burgess_attorneys_dev")
    ).toBe(true);
    expect(
      isSafeLocalDatabaseUrl("postgresql://user:password@db.example.com:5432/burgess_attorneys_dev")
    ).toBe(false);
    expect(isSafeLocalDatabaseUrl("postgresql://user:password@localhost:5432/production")).toBe(
      false
    );
    expect(isSafeLocalDatabaseUrl("not-a-url")).toBe(false);
  });

  it("skips DB tests when DATABASE_URL is unset", () => {
    vi.stubEnv("DATABASE_URL", "");

    expect(requireSafeLocalDatabaseUrl()).toBeNull();
  });

  it("returns safe local DB URLs and refuses unsafe URLs", () => {
    vi.stubEnv("DATABASE_URL", "postgresql://user:password@localhost:5432/burgess_attorneys_dev");

    expect(requireSafeLocalDatabaseUrl()).toBe(
      "postgresql://user:password@localhost:5432/burgess_attorneys_dev"
    );

    vi.stubEnv("DATABASE_URL", "postgresql://user:password@db.example.com:5432/burgess_attorneys_dev");

    expect(() => requireSafeLocalDatabaseUrl()).toThrow(
      "Refusing to run DB tests unless DATABASE_URL points to local burgess_attorneys_dev."
    );
  });
});
