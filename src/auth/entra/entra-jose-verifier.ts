import { importJWK, jwtVerify, type JWK } from "jose";

import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";

import type { EntraAuthConfig } from "./entra-config";
import {
  allowedEntraJwtAlgorithms,
  selectEntraJwksKey,
  type EntraJwksPublicKey,
  type EntraJwtAlgorithm
} from "./entra-jwks-key-selection";
import type { EntraVerifiedJwtClaims } from "./entra-jwt-verifier";

export type EntraJoseJwk = EntraJwksPublicKey & JWK & {
  kid: string;
  kty: "RSA";
  alg?: EntraJwtAlgorithm;
  use?: "sig";
};

export type EntraJoseVerifierInput = {
  rawIdToken?: string | null;
  config: Pick<EntraAuthConfig, "issuerUrl" | "clientId" | "tenantId">;
  expectedNonce: string;
  keys: readonly EntraJoseJwk[];
  allowedAlgorithms?: readonly EntraJwtAlgorithm[];
  now?: Date;
};

function fail(message: string): ServiceResult<never> {
  return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message });
}

function stringClaim(value: unknown): string | null {
  return typeof value === "string" && value.trim() === value && value.length > 0 ? value : null;
}

function claimDate(value: unknown): Date | null {
  return typeof value === "number" && Number.isSafeInteger(value)
    ? new Date(value * 1000)
    : null;
}

function audienceClaim(value: unknown): string | readonly string[] | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }

  return null;
}

export async function verifyEntraJwtWithJose(
  input: EntraJoseVerifierInput
): Promise<ServiceResult<EntraVerifiedJwtClaims>> {
  if (!input.rawIdToken?.trim()) {
    return fail("Microsoft Entra ID token is required.");
  }

  try {
    const [encodedHeader] = input.rawIdToken.split(".");
    const header = JSON.parse(Buffer.from(encodedHeader ?? "", "base64url").toString("utf8")) as {
      alg?: unknown;
      kid?: unknown;
    };
    const algorithm = typeof header.alg === "string" ? header.alg : undefined;
    const kid = typeof header.kid === "string" ? header.kid : undefined;
    const selected = selectEntraJwksKey({
      keys: input.keys,
      kid,
      algorithm,
      allowedAlgorithms: input.allowedAlgorithms ?? allowedEntraJwtAlgorithms()
    });

    if (!selected.ok) {
      return selected;
    }

    const jwk = input.keys.find((key) => key.kid === selected.data.kid);

    if (!jwk) {
      return fail("Microsoft Entra JWT signing key was not found.");
    }

    const key = await importJWK(jwk, selected.data.alg);
    const verified = await jwtVerify(input.rawIdToken, key, {
      issuer: input.config.issuerUrl,
      audience: input.config.clientId,
      algorithms: [selected.data.alg],
      currentDate: input.now
    });
    const payload = verified.payload;
    const tenantId = stringClaim(payload.tid);
    const nonce = stringClaim(payload.nonce);
    const subject = stringClaim(payload.oid) ?? stringClaim(payload.sub);
    const email =
      stringClaim(payload.email) ??
      stringClaim(payload.preferred_username) ??
      stringClaim(payload.upn);
    const expiresAt = claimDate(payload.exp);
    const notBefore = claimDate(payload.nbf) ?? undefined;

    if (tenantId !== input.config.tenantId) {
      return fail("Microsoft Entra JWT tenant is not allowed.");
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

    if (!expiresAt) {
      return fail("Microsoft Entra JWT expiry is required.");
    }

    return serviceSuccess({
      issuer: input.config.issuerUrl,
      audience: audienceClaim(payload.aud) ?? input.config.clientId,
      tenantId,
      expiresAt,
      notBefore,
      nonce,
      subject,
      email,
      claims: { ...payload }
    });
  } catch {
    return fail("Microsoft Entra JWT verification failed.");
  }
}
