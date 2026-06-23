import type { AuthenticatedPrincipal } from "./auth-provider";
import type { ProductionAuthProvider } from "./auth-config";
import type { ProductionAuthReadiness } from "./auth-readiness";
import { isRoleKey, type RoleKey } from "@/domain/roles";
import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";

export type ProductionAuthClaims = {
  subject?: string | null;
  email?: string | null;
  displayName?: string | null;
  roleClaims?: readonly string[] | null;
  provider: ProductionAuthProvider;
  issuedAt?: Date | null;
  expiresAt?: Date | null;
};

export type ProductionAuthPrincipal = AuthenticatedPrincipal & {
  displayName?: string;
  roles: readonly [RoleKey, ...RoleKey[]];
  providerSource: ProductionAuthProvider;
  session: {
    issuedAt?: Date;
    expiresAt?: Date;
  };
};

export type ProductionAuthAdapter = {
  readonly provider: ProductionAuthProvider;
  getCurrentPrincipal(): Promise<ServiceResult<ProductionAuthPrincipal | null>>;
};

export function mapProductionAuthClaimsToPrincipal(
  claims: ProductionAuthClaims,
  readiness: ProductionAuthReadiness
): ServiceResult<ProductionAuthPrincipal> {
  if (!readiness.ready) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Production auth is not configured."
    });
  }

  if (claims.subject?.trim() !== claims.subject || !claims.subject) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Production auth subject is required."
    });
  }

  if (claims.email?.trim() !== claims.email || !claims.email) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Production auth email is required."
    });
  }

  const role = claims.roleClaims?.[0];

  if (!role) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Production auth role claim is required."
    });
  }

  if (!isRoleKey(role)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Production auth role claim is not allowed."
    });
  }

  return serviceSuccess({
    userId: claims.subject,
    email: claims.email,
    displayName: claims.displayName ?? undefined,
    roles: [role],
    provider: "future_provider_backed",
    providerSource: claims.provider,
    session: {
      issuedAt: claims.issuedAt ?? undefined,
      expiresAt: claims.expiresAt ?? undefined
    }
  });
}

export function createProductionAuthAdapter(options: Readonly<{
  provider: ProductionAuthProvider;
  readiness: ProductionAuthReadiness;
  loadClaims(): Promise<ProductionAuthClaims | null>;
}>): ProductionAuthAdapter {
  return {
    provider: options.provider,
    async getCurrentPrincipal() {
      if (!options.readiness.ready) {
        return serviceFailure({
          code: "SERVICE_CONTEXT_ERROR",
          message: "Production auth is not configured."
        });
      }

      const claims = await options.loadClaims();

      return claims ? mapProductionAuthClaimsToPrincipal(claims, options.readiness) : serviceSuccess(null);
    }
  };
}
