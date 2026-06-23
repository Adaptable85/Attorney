import { type ServiceResult, serviceFailure } from "@/services/service-result";
import type { EntraAuthConfig } from "./entra-config";

export type EntraTokenValidationInput = {
  issuer?: string | null;
  audience?: string | readonly string[] | null;
  tenantId?: string | null;
  expiresAt?: Date | null;
  notBefore?: Date | null;
  nonce?: string | null;
  expectedNonce?: string | null;
  subject?: string | null;
  email?: string | null;
  signatureVerified?: boolean;
};

export type EntraTokenValidationFailureReason =
  | "issuer_missing"
  | "issuer_mismatch"
  | "audience_missing"
  | "audience_mismatch"
  | "tenant_mismatch"
  | "token_expired"
  | "token_not_yet_valid"
  | "nonce_missing"
  | "nonce_mismatch"
  | "subject_missing"
  | "email_missing"
  | "email_domain_not_allowed"
  | "cryptographic_verification_required";

export type EntraTokenValidationFailure = {
  reason: EntraTokenValidationFailureReason;
  message: string;
};

function fail(reason: EntraTokenValidationFailureReason, message: string): ServiceResult<never> {
  return serviceFailure({
    code: reason === "email_domain_not_allowed" || reason === "tenant_mismatch" ? "UNAUTHORIZED" : "SERVICE_CONTEXT_ERROR",
    message
  });
}

function audienceIncludes(audience: string | readonly string[] | null | undefined, clientId: string): boolean {
  if (typeof audience === "string") {
    return audience === clientId;
  }

  return Array.isArray(audience) && audience.includes(clientId);
}

function emailAllowed(email: string, allowedDomains: readonly string[]): boolean {
  const [, domain] = email.toLowerCase().split("@");

  return Boolean(domain && allowedDomains.includes(domain));
}

export function validateEntraTokenSkeleton(
  input: EntraTokenValidationInput,
  config: Pick<EntraAuthConfig, "issuerUrl" | "clientId" | "tenantId" | "allowedEmailDomains">,
  now: Date = new Date()
): ServiceResult<never> {
  if (!input.issuer) {
    return fail("issuer_missing", "Microsoft Entra token issuer is required.");
  }

  if (input.issuer !== config.issuerUrl) {
    return fail("issuer_mismatch", "Microsoft Entra token issuer is not allowed.");
  }

  if (!input.audience) {
    return fail("audience_missing", "Microsoft Entra token audience is required.");
  }

  if (!audienceIncludes(input.audience, config.clientId)) {
    return fail("audience_mismatch", "Microsoft Entra token audience is not allowed.");
  }

  if (input.tenantId !== config.tenantId) {
    return fail("tenant_mismatch", "Microsoft Entra token tenant is not allowed.");
  }

  if (!input.expiresAt || input.expiresAt <= now) {
    return fail("token_expired", "Microsoft Entra token is expired.");
  }

  if (input.notBefore && input.notBefore > now) {
    return fail("token_not_yet_valid", "Microsoft Entra token is not valid yet.");
  }

  if (!input.nonce || !input.expectedNonce) {
    return fail("nonce_missing", "Microsoft Entra token nonce is required.");
  }

  if (input.nonce !== input.expectedNonce) {
    return fail("nonce_mismatch", "Microsoft Entra token nonce does not match.");
  }

  if (!input.subject?.trim()) {
    return fail("subject_missing", "Microsoft Entra token subject is required.");
  }

  if (!input.email?.trim()) {
    return fail("email_missing", "Microsoft Entra token email is required.");
  }

  if (!emailAllowed(input.email, config.allowedEmailDomains)) {
    return fail("email_domain_not_allowed", "Microsoft Entra token email domain is not allowed.");
  }

  return fail(
    "cryptographic_verification_required",
    "Microsoft Entra token requires cryptographic JWKS validation before authentication."
  );
}

