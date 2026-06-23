import { mapProductionAuthClaimsToPrincipal, type ProductionAuthPrincipal } from "../production-auth-adapter";
import type { ProductionAuthReadiness } from "../auth-readiness";
import { isRoleKey } from "@/domain/roles";
import { type ServiceResult, serviceFailure } from "@/services/service-result";
import type { EntraAuthConfig } from "./entra-config";

export type EntraClaims = Record<string, unknown>;

function stringClaim(claims: EntraClaims, name: string): string | null {
  const value = claims[name];

  return typeof value === "string" && value.trim() === value && value.length > 0 ? value : null;
}

function roleClaim(claims: EntraClaims, name: string): string | null {
  const value = claims[name];

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length === 1 && typeof value[0] === "string") {
    return value[0];
  }

  return null;
}

function emailDomain(email: string): string | null {
  const [, domain] = email.toLowerCase().split("@");

  return domain ?? null;
}

export function mapEntraClaimsToPrincipal(
  claims: EntraClaims,
  config: EntraAuthConfig,
  readiness: ProductionAuthReadiness
): ServiceResult<ProductionAuthPrincipal> {
  const subject = stringClaim(claims, "oid") ?? stringClaim(claims, "sub");
  const email =
    stringClaim(claims, "email") ??
    stringClaim(claims, "preferred_username") ??
    stringClaim(claims, "upn");
  const role = roleClaim(claims, config.roleClaimName);
  const tenantId = stringClaim(claims, "tid");

  if (!subject) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Microsoft Entra subject claim is required."
    });
  }

  if (!email) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Microsoft Entra email claim is required."
    });
  }

  const domain = emailDomain(email);

  if (!domain || !config.allowedEmailDomains.includes(domain)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Microsoft Entra email domain is not allowed."
    });
  }

  if (tenantId && tenantId !== config.tenantId) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Microsoft Entra tenant claim is not allowed."
    });
  }

  if (!role) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Microsoft Entra role claim is required."
    });
  }

  if (!isRoleKey(role)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Microsoft Entra role claim is not allowed."
    });
  }

  return mapProductionAuthClaimsToPrincipal(
    {
      subject,
      email,
      displayName: stringClaim(claims, "name") ?? undefined,
      roleClaims: [role],
      provider: "microsoft_entra_id"
    },
    readiness
  );
}

