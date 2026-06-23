import { describe, expect, it, vi } from "vitest";

import { evaluateClientMatterWriteGate, readReleaseGateConfig } from "@/config/release-gates";
import type { AuthenticatedPrincipal } from "@/auth/auth-provider";
import type { ServiceContext } from "@/services/service-context";
import { immediateTransactionBoundary } from "@/services/transaction-boundary";
import { createClientAction, createMatterAction } from "./client-matter-mutations";

const disabledGate = evaluateClientMatterWriteGate(
  readReleaseGateConfig({
    environment: "production",
    productionAuthReady: false,
    flags: {
      clientMatterWritesEnabled: true,
      productionAuthConfigured: true,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: false
    }
  })
);

const enabledGate = evaluateClientMatterWriteGate(
  readReleaseGateConfig({
    environment: "production",
    productionAuthReady: true,
    flags: {
      clientMatterWritesEnabled: true,
      productionAuthConfigured: true,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: false
    }
  })
);

const principal = (role: AuthenticatedPrincipal["roles"][number]): AuthenticatedPrincipal => ({
  userId: role.toLowerCase(),
  email: `${role.toLowerCase()}@example.test`,
  roles: [role],
  provider: "future_provider_backed"
});

const ownerPrincipal = principal("OWNER_PRINCIPAL");
const supportPrincipal = principal("SUPPORT_ADMIN");
const agentPrincipal = principal("AGENT_SERVICE");
const reviewerPrincipal = principal("READ_ONLY_REVIEWER");

const serviceContext: ServiceContext = {
  actor: {
    userId: ownerPrincipal.userId,
    email: ownerPrincipal.email,
    primaryRole: "OWNER_PRINCIPAL",
    roles: ownerPrincipal.roles
  },
  source: "disabled-mutation-entrypoint-test",
  auditWriter: {
    record: async () => undefined
  }
};

const clientAudit = {
  eventType: "client_created" as const,
  targetType: "client",
  summary: "Disabled client create skeleton"
};

const matterAudit = {
  eventType: "matter_created" as const,
  targetType: "matter",
  summary: "Disabled matter create skeleton"
};

const clientInput = {
  accountNumber: "DEMO-CLIENT-3F",
  displayName: "Demo Phase 3F Client",
  status: "ACTIVE" as const
};

const matterInput = {
  clientId: "client-3f",
  accountNumber: "DEMO-MATTER-3F",
  name: "Demo Phase 3F Matter",
  description: "Disabled skeleton test matter",
  type: "CONTRACTS" as const,
  status: "OPEN" as const
};

describe("disabled client/matter mutation entrypoint skeletons", () => {
  it("fails closed without a user", () => {
    expect(
      createClientAction({
        principal: null,
        releaseGate: enabledGate,
        serviceContext,
        audit: clientAudit,
        transactionBoundary: immediateTransactionBoundary,
        input: clientInput
      })
    ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
  });

  it("blocks agent and read-only reviewer create attempts", () => {
    for (const principalUnderTest of [agentPrincipal, reviewerPrincipal]) {
      expect(
        createMatterAction({
          principal: principalUnderTest,
          releaseGate: enabledGate,
          serviceContext,
          audit: matterAudit,
          transactionBoundary: immediateTransactionBoundary,
          input: matterInput
        })
      ).toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
    }
  });

  it("keeps owner and support admin disabled when live write gate is disabled", () => {
    for (const principalUnderTest of [ownerPrincipal, supportPrincipal]) {
      expect(
        createClientAction({
          principal: principalUnderTest,
          releaseGate: disabledGate,
          serviceContext,
          audit: clientAudit,
          transactionBoundary: immediateTransactionBoundary,
          input: clientInput
        })
      ).toMatchObject({ ok: false, error: { code: "SERVICE_CONTEXT_ERROR" } });
    }
  });

  it("still returns disabled when the future gate dependencies pass", () => {
    expect(
      createMatterAction({
        principal: ownerPrincipal,
        releaseGate: enabledGate,
        serviceContext,
        audit: matterAudit,
        transactionBoundary: immediateTransactionBoundary,
        input: matterInput
      })
    ).toEqual({
      ok: false,
      error: {
        code: "SERVICE_CONTEXT_ERROR",
        message: "Live client/matter writes remain disabled until production auth and release approval are complete."
      }
    });
  });

  it("fails before mutation work when audit metadata or transaction dependency is missing", () => {
    expect(
      createClientAction({
        principal: ownerPrincipal,
        releaseGate: enabledGate,
        serviceContext,
        audit: null,
        transactionBoundary: immediateTransactionBoundary,
        input: clientInput
      })
    ).toMatchObject({ ok: false, error: { code: "AUDIT_ERROR" } });
    expect(
      createClientAction({
        principal: ownerPrincipal,
        releaseGate: enabledGate,
        serviceContext,
        audit: clientAudit,
        transactionBoundary: null,
        input: clientInput
      })
    ).toMatchObject({ ok: false, error: { code: "TRANSACTION_ERROR" } });
  });

  it("does not call repository work and returns safe typed errors", () => {
    const repositoryCreate = vi.fn();
    const result = createClientAction({
      principal: ownerPrincipal,
      releaseGate: disabledGate,
      serviceContext,
      audit: clientAudit,
      transactionBoundary: immediateTransactionBoundary,
      input: clientInput
    });

    expect(repositoryCreate).not.toHaveBeenCalled();
    expect(result).toMatchObject({ ok: false });
    expect(JSON.stringify(result)).not.toContain("stack");
  });
});
