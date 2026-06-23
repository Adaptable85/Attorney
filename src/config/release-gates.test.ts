import { describe, expect, it } from "vitest";

import { readFeatureFlags } from "./feature-flags";
import { evaluateClientMatterWriteGate, readReleaseGateConfig } from "./release-gates";

describe("release gates", () => {
  it("keeps all write flags off by default and fails closed for unknown values", () => {
    expect(readFeatureFlags({})).toEqual({
      clientMatterWritesEnabled: false,
      productionAuthConfigured: false,
      auditedPersistenceEnabled: false,
      localDevWritesEnabled: false
    });
    expect(
      readFeatureFlags({
        BURGESS_CLIENT_MATTER_WRITES_ENABLED: "yes",
        BURGESS_PRODUCTION_AUTH_CONFIGURED: "1",
        BURGESS_AUDITED_PERSISTENCE_ENABLED: "TRUE",
        BURGESS_LOCAL_DEV_WRITES_ENABLED: "enabled"
      })
    ).toEqual({
      clientMatterWritesEnabled: false,
      productionAuthConfigured: false,
      auditedPersistenceEnabled: false,
      localDevWritesEnabled: false
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
            localDevWritesEnabled: true
          }
        })
      )
    ).toEqual({ enabled: false, reason: "production_auth_missing" });
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
            localDevWritesEnabled: false
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
      localDevWritesEnabled: false
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
    ).toEqual({ enabled: true, reason: "enabled_for_local_dev" });
  });
});
