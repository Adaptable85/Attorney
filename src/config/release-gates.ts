import { readFeatureFlags, type FeatureFlags } from "./feature-flags";

export type ReleaseGateEnvironmentName = "production" | "development" | "test";

export type ReleaseGateConfig = {
  environment: ReleaseGateEnvironmentName;
  flags: FeatureFlags;
};

export type ClientMatterWriteGateDecision = {
  enabled: boolean;
  reason:
    | "enabled_for_production"
    | "enabled_for_local_dev"
    | "client_matter_writes_disabled"
    | "audited_persistence_disabled"
    | "production_auth_missing"
    | "local_dev_writes_disabled";
};

function environmentName(value: string | undefined): ReleaseGateEnvironmentName {
  return value === "production" || value === "development" || value === "test"
    ? value
    : "development";
}

export function readReleaseGateConfig(options?: {
  environment?: string;
  flags?: FeatureFlags;
  env?: Partial<Record<string, string | undefined>>;
  productionAuthReady?: boolean;
}): ReleaseGateConfig {
  const flags = options?.flags ?? readFeatureFlags(options?.env);

  return {
    environment: environmentName(options?.environment ?? options?.env?.NODE_ENV ?? process.env.NODE_ENV),
    flags: {
      ...flags,
      productionAuthConfigured:
        flags.productionAuthConfigured && options?.productionAuthReady !== false
    }
  };
}

export function evaluateClientMatterWriteGate(
  config: ReleaseGateConfig
): ClientMatterWriteGateDecision {
  if (!config.flags.clientMatterWritesEnabled) {
    return { enabled: false, reason: "client_matter_writes_disabled" };
  }

  if (!config.flags.auditedPersistenceEnabled) {
    return { enabled: false, reason: "audited_persistence_disabled" };
  }

  if (config.environment === "production") {
    return config.flags.productionAuthConfigured
      ? { enabled: true, reason: "enabled_for_production" }
      : { enabled: false, reason: "production_auth_missing" };
  }

  if (config.flags.localDevWritesEnabled) {
    return { enabled: true, reason: "enabled_for_local_dev" };
  }

  return { enabled: false, reason: "local_dev_writes_disabled" };
}
