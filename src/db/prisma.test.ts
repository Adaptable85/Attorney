import { afterEach, describe, expect, it } from "vitest";

import { getPrismaClient, hasDatabaseUrl, resetPrismaClientForTests } from "./prisma";

const originalDatabaseUrl = process.env.DATABASE_URL;

describe("Prisma client boundary", () => {
  afterEach(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
    resetPrismaClientForTests();
  });

  it("can be imported without requiring DATABASE_URL", () => {
    delete process.env.DATABASE_URL;
    expect(typeof hasDatabaseUrl()).toBe("boolean");
    expect(hasDatabaseUrl()).toBe(false);
  });

  it("detects when DATABASE_URL exists without exposing the secret", () => {
    process.env.DATABASE_URL = "postgresql://fake:fake@localhost:5432/fake";

    expect(hasDatabaseUrl()).toBe(true);
  });

  it("returns a cached Prisma-like client when one exists", async () => {
    const fakeClient = {
      async $connect() {},
      async $disconnect() {}
    };
    globalThis.burgessPrismaClient = fakeClient;

    await expect(getPrismaClient()).resolves.toBe(fakeClient);
  });

  it("can reset the cached Prisma client for tests", () => {
    globalThis.burgessPrismaClient = {
      async $connect() {},
      async $disconnect() {}
    };

    resetPrismaClientForTests();

    expect(globalThis.burgessPrismaClient).toBeUndefined();
  });

  it("does not hide missing generated Prisma client setup", async () => {
    await expect(getPrismaClient()).rejects.toThrow();
  });
});
