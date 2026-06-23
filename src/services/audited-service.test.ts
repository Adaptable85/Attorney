import { describe, expect, it, vi } from "vitest";

import { executeAuditedMutation } from "./audited-service";
import type { ServiceContext } from "./service-context";

function createContext(role: "OWNER_PRINCIPAL" | "READ_ONLY_REVIEWER"): ServiceContext {
  return {
    actor: {
      userId: role.toLowerCase(),
      email: `${role.toLowerCase()}@example.test`,
      primaryRole: role,
      roles: [role]
    },
    source: "unit-test",
    auditWriter: {
      record: vi.fn(async () => undefined)
    }
  };
}

describe("audited service execution", () => {
  it("returns a safe permission error when permission is denied", async () => {
    const result = await executeAuditedMutation({
      context: createContext("READ_ONLY_REVIEWER"),
      requiredPermission: "create_client",
      audit: {
        eventType: "client_created",
        targetType: "client",
        summary: "Create client"
      },
      run: async () => ({ id: "client" })
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "This user cannot perform the requested service action."
      }
    });
  });

  it("requires audit metadata for mutation-capable service actions", async () => {
    const result = await executeAuditedMutation({
      context: createContext("OWNER_PRINCIPAL"),
      requiredPermission: "create_client",
      audit: null,
      run: async () => ({ id: "client" })
    });

    expect(result).toMatchObject({ ok: false, error: { code: "AUDIT_ERROR" } });
  });

  it("records audit before running successful mutation preparation", async () => {
    const context = createContext("OWNER_PRINCIPAL");
    const run = vi.fn(async () => ({ id: "client" }));
    const result = await executeAuditedMutation({
      context,
      requiredPermission: "create_client",
      audit: {
        eventType: "client_created",
        targetType: "client",
        summary: "Create client"
      },
      run
    });

    expect(result).toMatchObject({ ok: true, data: { id: "client" } });
    expect(context.auditWriter.record).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "client_created",
        actorId: "owner_principal",
        targetType: "client",
        summary: "Create client"
      })
    );
    expect(run).toHaveBeenCalledOnce();
  });

  it("does not expose raw thrown errors as service errors", async () => {
    const result = await executeAuditedMutation({
      context: createContext("OWNER_PRINCIPAL"),
      requiredPermission: "create_client",
      audit: {
        eventType: "client_created",
        targetType: "client",
        summary: "Create client"
      },
      run: async () => {
        throw new Error("database password leaked");
      }
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "REPOSITORY_ERROR",
        message: "The requested records could not be loaded safely."
      }
    });
    expect(JSON.stringify(result)).not.toContain("database password leaked");
  });

  it("does not run mutation preparation when audit recording fails", async () => {
    const context = createContext("OWNER_PRINCIPAL");
    context.auditWriter = {
      record: vi.fn(async () => {
        throw new Error("audit unavailable");
      })
    };
    const run = vi.fn(async () => ({ id: "client" }));

    const result = await executeAuditedMutation({
      context,
      requiredPermission: "create_client",
      audit: {
        eventType: "client_created",
        targetType: "client",
        summary: "Create client"
      },
      run
    });

    expect(result).toMatchObject({ ok: false, error: { code: "AUDIT_ERROR" } });
    expect(run).not.toHaveBeenCalled();
  });
});
