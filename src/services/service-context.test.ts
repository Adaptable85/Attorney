import { describe, expect, it } from "vitest";

import { createServiceContext } from "./service-context";

describe("service context", () => {
  const auditWriter = { record: async () => undefined };

  it("requires an actor user id and at least one role", () => {
    expect(
      createServiceContext(null, {
        auditWriter,
        source: "unit-test"
      })
    ).toEqual({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR",
        message: "An authenticated service actor is required."
      }
    });
    expect(
      createServiceContext(
        {
          userId: "",
          email: "empty@example.test",
          roles: ["OWNER_PRINCIPAL"],
          provider: "local_dev_placeholder"
        },
        { auditWriter, source: "unit-test" }
      )
    ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
    expect(
      createServiceContext(
        {
          userId: "empty-role",
          email: "empty-role@example.test",
          roles: [],
          provider: "local_dev_placeholder"
        },
        { auditWriter, source: "unit-test" }
      )
    ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
  });

  it("creates service context with actor, primary role and audit writer", () => {
    expect(
      createServiceContext(
        {
          userId: "owner",
          email: "owner@example.test",
          roles: ["OWNER_PRINCIPAL"],
          provider: "local_dev_placeholder"
        },
        { auditWriter, source: "unit-test" }
      )
    ).toMatchObject({
      ok: true,
      data: {
        actor: {
          userId: "owner",
          primaryRole: "OWNER_PRINCIPAL"
        },
        source: "unit-test"
      }
    });
  });
});
