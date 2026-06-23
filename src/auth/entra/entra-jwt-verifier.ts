import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";

import type { EntraAuthConfig } from "./entra-config";
import {
  allowedEntraJwtAlgorithms,
  selectEntraJwksKey,
  type EntraJwksPublicKey,
  type EntraJwtAlgorithm
} from "./entra-jwks-key-selection";

export type EntraJwtHeader = {
  alg?: string;
  kid?: string;
  typ?: string;
};

export type EntraVerifiedJwtClaims = {
  issuer: string;
  audience: string | readonly string[];
  tenantId: string;
  expiresAt: Date;
  notBefore?: Date;
  nonce: string;
  subject: string;
  email: string;
  claims: Record<string, unknown>;
};

export type EntraJwtSignatureVerifierInput = {
  rawIdToken: string;
  header: EntraJwtHeader;
  key: EntraJwksPublicKey & { kid: string; alg: EntraJwtAlgorithm; kty: "RSA" };
};

export type EntraJwtSignatureVerifier = (
  input: EntraJwtSignatureVerifierInput
) => ServiceResult<{ verified: true }>;

export type EntraJwtVerificationInput = {
  rawIdToken?: string | null;
  expectedIssuer: string;
  expectedAudience: string;
  expectedTenantId: string;
  expectedNonce: string;
  keys: readonly EntraJwksPublicKey[];
  allowedAlgorithms?: readonly EntraJwtAlgorithm[];
  signatureVerifier?: EntraJwtSignatureVerifier;
  now?: Date;
};

function fail(message: string): ServiceResult<never> {
  return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message });
}

function decodeBase64UrlJson(segment: string): ServiceResult<Record<string, unknown>> {
  try {
    const parsed = JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return fail("Microsoft Entra JWT segment is invalid.");
    }

    return serviceSuccess(parsed as Record<string, unknown>);
  } catch {
    return fail("Microsoft Entra JWT segment is malformed.");
  }
}

function stringClaim(claims: Record<string, unknown>, name: string): string | null {
  const value = claims[name];

  return typeof value === "string" && value.trim() === value && value.length > 0 ? value : null;
}

function audienceClaim(claims: Record<string, unknown>): string | readonly string[] | null {
  const value = claims.aud;

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }

  return null;
}

function dateClaim(claims: Record<string, unknown>, name: string): Date | null {
  const value = claims[name];

  return typeof value === "number" && Number.isSafeInteger(value)
    ? new Date(value * 1000)
    : null;
}

function audienceMatches(audience: string | readonly string[] | null, expected: string): boolean {
  return typeof audience === "string" ? audience === expected : Array.isArray(audience) && audience.includes(expected);
}

export function verifyEntraJwt(input: EntraJwtVerificationInput): ServiceResult<EntraVerifiedJwtClaims> {
  const now = input.now ?? new Date();

  if (!input.rawIdToken?.trim()) {
    return fail("Microsoft Entra ID token is required.");
  }

  const segments = input.rawIdToken.split(".");

  if (segments.length !== 3 || segments.some((segment) => segment.length === 0)) {
    return fail("Microsoft Entra ID token is malformed.");
  }

  const header = decodeBase64UrlJson(segments[0]);

  if (!header.ok) {
    return header;
  }

  const typedHeader: EntraJwtHeader = {
    alg: typeof header.data.alg === "string" ? header.data.alg : undefined,
    kid: typeof header.data.kid === "string" ? header.data.kid : undefined,
    typ: typeof header.data.typ === "string" ? header.data.typ : undefined
  };

  const key = selectEntraJwksKey({
    keys: input.keys,
    kid: typedHeader.kid,
    algorithm: typedHeader.alg,
    allowedAlgorithms: input.allowedAlgorithms ?? allowedEntraJwtAlgorithms()
  });

  if (!key.ok) {
    return key;
  }

  if (!input.signatureVerifier) {
    return fail("Microsoft Entra JWT cryptographic verifier is not configured.");
  }

  const signature = input.signatureVerifier({
    rawIdToken: input.rawIdToken,
    header: typedHeader,
    key: key.data
  });

  if (!signature.ok) {
    return fail("Microsoft Entra JWT signature verification failed.");
  }

  const claims = decodeBase64UrlJson(segments[1]);

  if (!claims.ok) {
    return claims;
  }

  const issuer = stringClaim(claims.data, "iss");
  const audience = audienceClaim(claims.data);
  const tenantId = stringClaim(claims.data, "tid");
  const expiresAt = dateClaim(claims.data, "exp");
  const notBefore = dateClaim(claims.data, "nbf") ?? undefined;
  const nonce = stringClaim(claims.data, "nonce");
  const subject = stringClaim(claims.data, "oid") ?? stringClaim(claims.data, "sub");
  const email =
    stringClaim(claims.data, "email") ??
    stringClaim(claims.data, "preferred_username") ??
    stringClaim(claims.data, "upn");

  if (issuer !== input.expectedIssuer) {
    return fail("Microsoft Entra JWT issuer is not allowed.");
  }

  if (!audienceMatches(audience, input.expectedAudience)) {
    return fail("Microsoft Entra JWT audience is not allowed.");
  }

  if (tenantId !== input.expectedTenantId) {
    return fail("Microsoft Entra JWT tenant is not allowed.");
  }

  if (!expiresAt || expiresAt <= now) {
    return fail("Microsoft Entra JWT is expired.");
  }

  if (notBefore && notBefore > now) {
    return fail("Microsoft Entra JWT is not valid yet.");
  }

  if (!nonce || nonce !== input.expectedNonce) {
    return fail("Microsoft Entra JWT nonce does not match.");
  }

  if (!subject) {
    return fail("Microsoft Entra JWT subject is required.");
  }

  if (!email) {
    return fail("Microsoft Entra JWT email is required.");
  }

  return serviceSuccess({
    issuer,
    audience: audience ?? input.expectedAudience,
    tenantId,
    expiresAt,
    notBefore,
    nonce,
    subject,
    email,
    claims: claims.data
  });
}

export function createEntraJwtVerificationInput(options: {
  rawIdToken: string;
  config: Pick<EntraAuthConfig, "issuerUrl" | "clientId" | "tenantId">;
  expectedNonce: string;
  keys: readonly EntraJwksPublicKey[];
  signatureVerifier?: EntraJwtSignatureVerifier;
  now?: Date;
}): EntraJwtVerificationInput {
  return {
    rawIdToken: options.rawIdToken,
    expectedIssuer: options.config.issuerUrl,
    expectedAudience: options.config.clientId,
    expectedTenantId: options.config.tenantId,
    expectedNonce: options.expectedNonce,
    keys: options.keys,
    signatureVerifier: options.signatureVerifier,
    now: options.now
  };
}
