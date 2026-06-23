import { describe, expect, it } from "vitest";

import { evaluateClientMatterWriteGate, readReleaseGateConfig } from "@/config/release-gates";
import type { ServiceContext } from "./service-context";
import { evaluateMutationGate } from "./mutation-gate";
import { immediateTransactionBoundary } from "./transaction-boundary";

const enabledGate = evaluateClientMatterWriteGate(
  readReleaseGateConfig({
    environment: "production",
    flags: {
      clientMatterWritesEnabled: true,
      productionAuthConfigured: true,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: false,
      devMutationEntrypointsEnabled: false,
      productionWritesEnabled: true
    }
  })
);

const disabledGate = evaluateClientMatterWriteGate(
  readReleaseGateConfig({
    environment: "production",
    flags: {
      clientMatterWritesEnabled: false,
      productionAuthConfigured: true,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: false,
      devMutationEntrypointsEnabled: false,
      productionWritesEnabled: true
    }
  })
);

const ownerPrincipal = {
  userId: "owner",
  email: "owner@example.test",
  roles: ["OWNER_PRINCIPAL" as const],
  provider: "future_provider_backed" as const
};

const supportPrincipal = {
  userId: "support",
  email: "support@example.test",
  roles: ["SUPPORT_ADMIN" as const],
  provider: "future_provider_backed" as const
};

const agentPrincipal = {
  userId: "agent",
  email: "agent@example.test",
  roles: ["AGENT_SERVICE" as const],
  provider: "future_provider_backed" as const
};

const reviewerPrincipal = {
  userId: "reviewer",
  email: "reviewer@example.test",
  roles: ["READ_ONLY_REVIEWER" as const],
  provider: "future_provider_backed" as const
};

const audit = {
  eventType: "client_created" as const,
  targetType: "client",
  summary: "Future client create mutation"
};

const serviceContext: ServiceContext = {
  actor: {
    userId: ownerPrincipal.userId,
    email: ownerPrincipal.email,
    primaryRole: "OWNER_PRINCIPAL",
    roles: ownerPrincipal.roles
  },
  source: "mutation-gate-test",
  auditWriter: {
    record: async () => undefined
  }
};

describe("mutation gate", () => {
  it("blocks every principal when the release gate is disabled", () => {
    expect(
      evaluateMutationGate({
        principal: ownerPrincipal,
        releaseGate: disabledGate,
        serviceContext,
        permission: "create_client",
        audit,
        transactionBoundary: immediateTransactionBoundary
      })
    ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
  });

  it("blocks missing users before mutation work can be prepared", () => {
    expect(
      evaluateMutationGate({
        principal: null,
        releaseGate: enabledGate,
        serviceContext,
        permission: "create_client",
        audit,
        transactionBoundary: immediateTransactionBoundary
      })
    ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
  });

  it("blocks agent and read-only reviewer users from create mutations", () => {
    for (const principal of [agentPrincipal, reviewerPrincipal]) {
      expect(
        evaluateMutationGate({
          principal,
          releaseGate: enabledGate,
          serviceContext,
          permission: "create_client",
          audit,
          transactionBoundary: immediateTransactionBoundary
        })
      ).toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
    }
  });

  it("allows owner and support admin users only when gate and permission allow", () => {
    for (const principal of [ownerPrincipal, supportPrincipal]) {
      expect(
        evaluateMutationGate({
          principal,
          releaseGate: enabledGate,
          serviceContext,
          permission: "create_client",
          audit,
          transactionBoundary: immediateTransactionBoundary
        })
      ).toMatchObject({ ok: true });
    }
  });

  it("requires audit metadata and transaction dependency", () => {
    expect(
      evaluateMutationGate({
        principal: ownerPrincipal,
        releaseGate: enabledGate,
        serviceContext,
        permission: "create_client",
        audit: null,
        transactionBoundary: immediateTransactionBoundary
      })
    ).toMatchObject({ ok: false, error: { code: "AUDIT_ERROR" } });
    expect(
      evaluateMutationGate({
        principal: ownerPrincipal,
        releaseGate: enabledGate,
        serviceContext,
        permission: "create_client",
        audit,
        transactionBoundary: null
      })
    ).toMatchObject({ ok: false, error: { code: "TRANSACTION_ERROR" } });
  });

  it("requires an explicit permission decision and returns safe typed errors", () => {
    const result = evaluateMutationGate({
      principal: ownerPrincipal,
      releaseGate: enabledGate,
      serviceContext,
      permission: null,
      audit,
      transactionBoundary: immediateTransactionBoundary
    });

    expect(result).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
    expect(JSON.stringify(result)).not.toContain("stack");
  });

  it("requires service context before permissioned mutation work", () => {
    expect(
      evaluateMutationGate({
        principal: ownerPrincipal,
        releaseGate: enabledGate,
        serviceContext: null,
        permission: "create_client",
        audit,
        transactionBoundary: immediateTransactionBoundary
      })
    ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
  });
});
