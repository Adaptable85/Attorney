import { type ProductionAuthConfig, readProductionAuthConfig } from "./auth-config";

export type ProductionAuthReadiness =
  | {
      ready: true;
      provider: NonNullable<ProductionAuthConfig["provider"]>;
    }
  | {
      ready: false;
      reason:
        | "provider_missing"
        | "provider_unknown"
        | "provider_not_production"
        | "explicit_enablement_missing";
    };

type AuthEnvironment = Partial<Record<string, string | undefined>>;

export function evaluateProductionAuthReadiness(
  config: ProductionAuthConfig,
  rawProvider?: string
): ProductionAuthReadiness {
  if (rawProvider === "local_dev_placeholder") {
    return { ready: false, reason: "provider_not_production" };
  }

  if (rawProvider && !config.provider) {
    return { ready: false, reason: "provider_unknown" };
  }

  if (!config.provider) {
    return { ready: false, reason: "provider_missing" };
  }

  if (!config.explicitlyEnabled) {
    return { ready: false, reason: "explicit_enablement_missing" };
  }

  return { ready: true, provider: config.provider };
}

export function readProductionAuthReadiness(
  environment: AuthEnvironment = process.env
): ProductionAuthReadiness {
  return evaluateProductionAuthReadiness(
    readProductionAuthConfig(environment),
    environment.BURGESS_PRODUCTION_AUTH_PROVIDER
  );
}
