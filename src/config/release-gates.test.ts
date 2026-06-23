import { describe, expect, it } from "vitest";

import { readFeatureFlags } from "./feature-flags";
import { evaluateClientMatterWriteGate, readReleaseGateConfig } from "./release-gates";

describe("release gates", () => {
  it("keeps all write flags off by default and fails closed for unknown values", () => {
    expect(readFeatureFlags({})).toEqual({
      clientMatterWritesEnabled: false,
      productionAuthConfigured: false,
      auditedPersistenceEnabled: false,
      localDevWritesEnabled: false,
      devMutationEntrypointsEnabled: false,
      entraStagingAuthWiringEnabled: false,
      productionWritesEnabled: false
    });
    expect(
      readFeatureFlags({
        BURGESS_CLIENT_MATTER_WRITES_ENABLED: "yes",
        BURGESS_PRODUCTION_AUTH_CONFIGURED: "1",
        BURGESS_AUDITED_PERSISTENCE_ENABLED: "TRUE",
        BURGESS_LOCAL_DEV_WRITES_ENABLED: "enabled",
        BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED: "on",
        BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED: "enabled",
        BURGESS_PRODUCTION_WRITES_ENABLED: "yes"
      })
    ).toEqual({
      clientMatterWritesEnabled: false,
      productionAuthConfigured: false,
      auditedPersistenceEnabled: false,
      localDevWritesEnabled: false,
      devMutationEntrypointsEnabled: false,
      entraStagingAuthWiringEnabled: false,
      productionWritesEnabled: false
    });
  });

  it("keeps production writes disabled without production auth", () => {
    expect(
      evaluateClientMatterWriteGate(
        readReleaseGateConfig({
          environment: "production",
          flags: {
            clientMatterWritesEnabled: true,
            productionAuthConfigured: false,
            auditedPersistenceEnabled: true,
            localDevWritesEnabled: true,
            devMutationEntrypointsEnabled: true,
            entraStagingAuthWiringEnabled: false,
            productionWritesEnabled: true
          }
        })
      )
    ).toEqual({ enabled: false, reason: "production_auth_missing" });
  });

  it("keeps production writes disabled when auth readiness is false even if raw flags are enabled", () => {
    expect(
      evaluateClientMatterWriteGate(
        readReleaseGateConfig({
          environment: "production",
          productionAuthReady: false,
          flags: {
            clientMatterWritesEnabled: true,
            productionAuthConfigured: true,
            auditedPersistenceEnabled: true,
            localDevWritesEnabled: false,
            devMutationEntrypointsEnabled: false,
            entraStagingAuthWiringEnabled: false,
            productionWritesEnabled: true
          }
        })
      )
    ).toEqual({ enabled: false, reason: "production_auth_missing" });
  });

  it("keeps production writes disabled unless the production write gate is explicit", () => {
    expect(
      evaluateClientMatterWriteGate(
        readReleaseGateConfig({
          environment: "production",
          productionAuthReady: true,
          flags: {
            clientMatterWritesEnabled: true,
            productionAuthConfigured: true,
            auditedPersistenceEnabled: true,
            localDevWritesEnabled: true,
            devMutationEntrypointsEnabled: true,
            entraStagingAuthWiringEnabled: true,
            productionWritesEnabled: false
          }
        })
      )
    ).toEqual({ enabled: false, reason: "production_writes_disabled" });
  });

  it("requires every production write gate to be explicitly enabled", () => {
    expect(
      evaluateClientMatterWriteGate(
        readReleaseGateConfig({
          environment: "production",
          flags: {
            clientMatterWritesEnabled: true,
            productionAuthConfigured: true,
            auditedPersistenceEnabled: true,
            localDevWritesEnabled: false,
            devMutationEntrypointsEnabled: false,
            entraStagingAuthWiringEnabled: true,
            productionWritesEnabled: true
          }
        })
      )
    ).toEqual({ enabled: true, reason: "enabled_for_production" });
  });

  it("allows local/dev writes only through the explicit dev-only gate", () => {
    const baseFlags = {
      clientMatterWritesEnabled: true,
      productionAuthConfigured: false,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: false,
      devMutationEntrypointsEnabled: false,
      entraStagingAuthWiringEnabled: false,
      productionWritesEnabled: false
    };

    expect(
      evaluateClientMatterWriteGate(
        readReleaseGateConfig({ environment: "test", flags: baseFlags })
      )
    ).toEqual({ enabled: false, reason: "local_dev_writes_disabled" });
    expect(
      evaluateClientMatterWriteGate(
        readReleaseGateConfig({
          environment: "test",
          flags: {
            ...baseFlags,
            localDevWritesEnabled: true
          }
        })
      )
    ).toEqual({ enabled: false, reason: "dev_mutation_entrypoints_disabled" });
    expect(
      evaluateClientMatterWriteGate(
        readReleaseGateConfig({
          environment: "test",
          flags: {
            ...baseFlags,
            localDevWritesEnabled: true,
            devMutationEntrypointsEnabled: true
          }
        })
      )
    ).toEqual({ enabled: true, reason: "enabled_for_local_dev" });
  });

  it("explicit local/dev config does not imply production writes", () => {
    const flags = {
      clientMatterWritesEnabled: true,
      productionAuthConfigured: false,
      auditedPersistenceEnabled: true,
      localDevWritesEnabled: true,
      devMutationEntrypointsEnabled: true,
      entraStagingAuthWiringEnabled: false,
      productionWritesEnabled: false
    };

    expect(
      evaluateClientMatterWriteGate(readReleaseGateConfig({ environment: "test", flags }))
    ).toEqual({ enabled: true, reason: "enabled_for_local_dev" });
    expect(
      evaluateClientMatterWriteGate(readReleaseGateConfig({ environment: "production", flags }))
    ).toEqual({ enabled: false, reason: "production_auth_missing" });
  });
});
