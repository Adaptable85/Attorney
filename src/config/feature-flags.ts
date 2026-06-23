export type FeatureFlagName =
  | "clientMatterWritesEnabled"
  | "productionAuthConfigured"
  | "auditedPersistenceEnabled"
  | "localDevWritesEnabled"
  | "devMutationEntrypointsEnabled"
  | "productionWritesEnabled";

export type FeatureFlags = Record<FeatureFlagName, boolean>;

type FeatureFlagEnvironment = Partial<Record<string, string | undefined>>;

const enabledValue = "true";

function readBooleanFlag(value: string | undefined): boolean {
  return value === enabledValue;
}

export function readFeatureFlags(environment: FeatureFlagEnvironment = process.env): FeatureFlags {
  return {
    clientMatterWritesEnabled: readBooleanFlag(environment.BURGESS_CLIENT_MATTER_WRITES_ENABLED),
    productionAuthConfigured: readBooleanFlag(environment.BURGESS_PRODUCTION_AUTH_CONFIGURED),
    auditedPersistenceEnabled: readBooleanFlag(environment.BURGESS_AUDITED_PERSISTENCE_ENABLED),
    localDevWritesEnabled: readBooleanFlag(environment.BURGESS_LOCAL_DEV_WRITES_ENABLED),
    devMutationEntrypointsEnabled: readBooleanFlag(
      environment.BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED
    ),
    productionWritesEnabled: readBooleanFlag(environment.BURGESS_PRODUCTION_WRITES_ENABLED)
  };
}
