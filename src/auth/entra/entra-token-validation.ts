import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";
import type { EntraAuthConfig } from "./entra-config";
import type { EntraJwksMetadata } from "./entra-jwks-cache";
import type {
  EntraJwtSignatureVerifier,
  EntraVerifiedJwtClaims
} from "./entra-jwt-verifier";
import { createEntraJwtVerificationInput, verifyEntraJwt } from "./entra-jwt-verifier";
import type { EntraJwksPublicKey } from "./entra-jwks-key-selection";

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
  jwksMetadata?: EntraJwksMetadata | null;
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
  | "jwks_unavailable"
  | "jwks_issuer_mismatch"
  | "jwks_expired"
  | "verifier_missing"
  | "verifier_failed"
  | "cryptographic_verification_required";

export type EntraTokenValidationFailure = {
  reason: EntraTokenValidationFailureReason;
  message: string;
};

function fail(reason: EntraTokenValidationFailureReason, message: string): ServiceResult<never> {
  return serviceFailure({
    code: reason === "email_domain_not_allowed" ||
      reason === "tenant_mismatch" ||
      reason === "jwks_issuer_mismatch"
      ? "UNAUTHORIZED"
      : "SERVICE_CONTEXT_ERROR",
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

function validateVerifiedClaims(
  input: EntraTokenValidationInput,
  config: Pick<EntraAuthConfig, "issuerUrl" | "clientId" | "tenantId" | "allowedEmailDomains">,
  now: Date,
  options?: { cryptographicVerificationRequired?: boolean }
): ServiceResult<EntraVerifiedJwtClaims | never> {
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

  if (!input.jwksMetadata) {
    return fail("jwks_unavailable", "Microsoft Entra JWKS metadata is required.");
  }

  if (input.jwksMetadata.issuerUrl !== config.issuerUrl) {
    return fail("jwks_issuer_mismatch", "Microsoft Entra JWKS metadata issuer is not allowed.");
  }

  if (input.jwksMetadata.expiresAt <= now) {
    return fail("jwks_expired", "Microsoft Entra JWKS metadata is expired.");
  }

  if (options?.cryptographicVerificationRequired === false) {
    return serviceSuccess({
      issuer: input.issuer,
      audience: input.audience,
      tenantId: input.tenantId,
      expiresAt: input.expiresAt,
      notBefore: input.notBefore ?? undefined,
      nonce: input.nonce,
      subject: input.subject,
      email: input.email,
      claims: {
        iss: input.issuer,
        aud: input.audience,
        tid: input.tenantId,
        exp: Math.floor(input.expiresAt.getTime() / 1000),
        nbf: input.notBefore ? Math.floor(input.notBefore.getTime() / 1000) : undefined,
        nonce: input.nonce,
        oid: input.subject,
        email: input.email
      }
    });
  }

  return fail(
    "cryptographic_verification_required",
    "Microsoft Entra token requires cryptographic JWKS validation before authentication."
  );
}

export function validateEntraTokenSkeleton(
  input: EntraTokenValidationInput,
  config: Pick<EntraAuthConfig, "issuerUrl" | "clientId" | "tenantId" | "allowedEmailDomains">,
  now: Date = new Date()
): ServiceResult<never> {
  return validateVerifiedClaims(input, config, now) as ServiceResult<never>;
}

export function validateVerifiedEntraTokenSkeleton(
  input: {
    rawIdToken?: string | null;
    expectedNonce?: string | null;
    jwksKeys?: readonly EntraJwksPublicKey[] | null;
    signatureVerifier?: EntraJwtSignatureVerifier;
    jwksMetadata?: EntraJwksMetadata | null;
  },
  config: Pick<EntraAuthConfig, "issuerUrl" | "clientId" | "tenantId" | "allowedEmailDomains">,
  now: Date = new Date()
): ServiceResult<EntraVerifiedJwtClaims> {
  if (!input.signatureVerifier) {
    return fail("verifier_missing", "Microsoft Entra JWT verifier is required.");
  }

  const verified = verifyEntraJwt(createEntraJwtVerificationInput({
    rawIdToken: input.rawIdToken ?? "",
    config,
    expectedNonce: input.expectedNonce ?? "",
    keys: input.jwksKeys ?? [],
    signatureVerifier: input.signatureVerifier,
    now
  }));

  if (!verified.ok) {
    return fail("verifier_failed", verified.error.message);
  }

  const structural = validateVerifiedClaims(
    {
      issuer: verified.data.issuer,
      audience: verified.data.audience,
      tenantId: verified.data.tenantId,
      expiresAt: verified.data.expiresAt,
      notBefore: verified.data.notBefore,
      nonce: verified.data.nonce,
      expectedNonce: input.expectedNonce,
      subject: verified.data.subject,
      email: verified.data.email,
      jwksMetadata: input.jwksMetadata
    },
    config,
    now,
    { cryptographicVerificationRequired: false }
  );

  if (!structural.ok) {
    return structural;
  }

  return serviceSuccess({
    ...verified.data,
    claims: verified.data.claims
  });
}
