import { randomBytes } from "node:crypto";

import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";

export type OAuthProviderMarker = "microsoft_entra_id";

export type OAuthStatePayload = {
  provider: OAuthProviderMarker;
  state: string;
  nonce: string;
  redirectTarget: string;
  issuedAt: Date;
  expiresAt: Date;
};

export type OAuthStateInput = {
  provider?: string | null;
  state?: string | null;
  nonce?: string | null;
  redirectTarget?: string | null;
  issuedAt?: Date | null;
  expiresAt?: Date | null;
};

const defaultLifetimeMs = 10 * 60 * 1000;
const tokenPattern = /^[A-Za-z0-9_-]{32,256}$/;
const safeRedirectTargets = ["/admin", "/admin/dashboard"] as const;

function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

function isSafeRedirectTarget(value: string): boolean {
  return safeRedirectTargets.some((target) => value === target || value.startsWith(`${target}/`));
}

export function createOAuthStatePayload(options?: {
  provider?: OAuthProviderMarker;
  redirectTarget?: string;
  now?: Date;
  lifetimeMs?: number;
  state?: string;
  nonce?: string;
}): ServiceResult<OAuthStatePayload> {
  const now = options?.now ?? new Date();
  const redirectTarget = options?.redirectTarget ?? "/admin";

  if (!isSafeRedirectTarget(redirectTarget)) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "OAuth redirect target is not allowed."
    });
  }

  return serviceSuccess({
    provider: options?.provider ?? "microsoft_entra_id",
    state: options?.state ?? randomToken(),
    nonce: options?.nonce ?? randomToken(),
    redirectTarget,
    issuedAt: now,
    expiresAt: new Date(now.getTime() + (options?.lifetimeMs ?? defaultLifetimeMs))
  });
}

export function validateOAuthStatePayload(
  input: OAuthStateInput,
  options?: {
    expectedProvider?: OAuthProviderMarker;
    now?: Date;
  }
): ServiceResult<OAuthStatePayload> {
  const expectedProvider = options?.expectedProvider ?? "microsoft_entra_id";
  const now = options?.now ?? new Date();

  if (input.provider !== expectedProvider) {
    return serviceFailure({ code: "UNAUTHORIZED", message: "OAuth state provider is not allowed." });
  }

  if (!input.state || !tokenPattern.test(input.state)) {
    return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message: "OAuth state value is invalid." });
  }

  if (!input.nonce || !tokenPattern.test(input.nonce)) {
    return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message: "OAuth nonce value is invalid." });
  }

  if (!input.redirectTarget || !isSafeRedirectTarget(input.redirectTarget)) {
    return serviceFailure({ code: "UNAUTHORIZED", message: "OAuth redirect target is not allowed." });
  }

  if (!input.issuedAt || !input.expiresAt || input.expiresAt <= input.issuedAt) {
    return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message: "OAuth state timestamps are invalid." });
  }

  if (input.expiresAt <= now) {
    return serviceFailure({ code: "UNAUTHORIZED", message: "OAuth state is expired." });
  }

  return serviceSuccess({
    provider: expectedProvider,
    state: input.state,
    nonce: input.nonce,
    redirectTarget: input.redirectTarget,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt
  });
}

