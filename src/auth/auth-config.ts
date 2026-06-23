export const PRODUCTION_AUTH_PROVIDERS = [
  "microsoft_entra_id",
  "auth0",
  "clerk",
  "authjs"
] as const;

export type ProductionAuthProvider = (typeof PRODUCTION_AUTH_PROVIDERS)[number];

export type ProductionAuthConfig = {
  provider: ProductionAuthProvider | null;
  explicitlyEnabled: boolean;
};

type AuthEnvironment = Partial<Record<string, string | undefined>>;

const enabledValue = "true";

export function isProductionAuthProvider(value: string): value is ProductionAuthProvider {
  return PRODUCTION_AUTH_PROVIDERS.includes(value as ProductionAuthProvider);
}

export function readProductionAuthConfig(environment: AuthEnvironment = process.env): ProductionAuthConfig {
  const provider = environment.BURGESS_PRODUCTION_AUTH_PROVIDER;

  return {
    provider: provider && isProductionAuthProvider(provider) ? provider : null,
    explicitlyEnabled: environment.BURGESS_PRODUCTION_AUTH_ENABLED === enabledValue
  };
}
