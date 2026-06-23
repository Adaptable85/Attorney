import { readProductionAuthReadiness, type ProductionAuthReadiness } from "../auth-readiness";
import type { ProductionAuthAdapter, ProductionAuthPrincipal } from "../production-auth-adapter";
import { type ServiceResult, serviceFailure } from "@/services/service-result";
import { mapEntraClaimsToPrincipal, type EntraClaims } from "./entra-claims";
import { readEntraAuthConfig, type EntraAuthConfigReadiness } from "./entra-config";

type EntraEnvironment = Partial<Record<string, string | undefined>>;

export type EntraAuthAdapter = ProductionAuthAdapter & {
  readonly configReadiness: EntraAuthConfigReadiness;
  readonly productionReadiness: ProductionAuthReadiness;
  mapClaims(claims: EntraClaims): ServiceResult<ProductionAuthPrincipal>;
};

export function createEntraAuthAdapter(options?: {
  environment?: EntraEnvironment;
  loadClaims?: () => Promise<EntraClaims | null>;
}): EntraAuthAdapter {
  const environment = options?.environment ?? process.env;
  const configReadiness = readEntraAuthConfig(environment);
  const productionReadiness = readProductionAuthReadiness(environment);

  return {
    provider: "microsoft_entra_id",
    configReadiness,
    productionReadiness,
    mapClaims(claims) {
      if (!configReadiness.ready) {
        return serviceFailure({
          code: "SERVICE_CONTEXT_ERROR",
          message: "Microsoft Entra auth is not configured."
        });
      }

      return mapEntraClaimsToPrincipal(claims, configReadiness.config, productionReadiness);
    },
    async getCurrentPrincipal() {
      if (!configReadiness.ready || !productionReadiness.ready) {
        return serviceFailure({
          code: "SERVICE_CONTEXT_ERROR",
          message: "Microsoft Entra auth is not configured."
        });
      }

      const claims = await options?.loadClaims?.();

      return claims ? this.mapClaims(claims) : serviceFailure({
        code: "SERVICE_CONTEXT_ERROR",
        message: "Microsoft Entra live login is not implemented."
      });
    }
  };
}

