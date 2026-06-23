import { type RoleKey, isRoleKey } from "@/domain/roles";
import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";
import type { ProductionAuthProvider } from "./auth-config";

export type FutureAuthSessionShape = {
  userId: string;
  email: string;
  displayName?: string;
  roleKey: RoleKey;
  provider: ProductionAuthProvider;
  issuedAt: Date;
  expiresAt: Date;
};

export type FutureAuthSessionInput = {
  userId?: string | null;
  email?: string | null;
  displayName?: string | null;
  roleKey?: string | null;
  provider?: string | null;
  issuedAt?: Date | null;
  expiresAt?: Date | null;
};

function isProductionAuthProvider(value: string | null | undefined): value is ProductionAuthProvider {
  return value === "microsoft_entra_id" || value === "auth0" || value === "clerk" || value === "authjs";
}

export function validateFutureAuthSessionShape(
  input: FutureAuthSessionInput,
  now: Date = new Date()
): ServiceResult<FutureAuthSessionShape> {
  if (!input.userId?.trim() || input.userId.trim() !== input.userId) {
    return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message: "Session user ID is required." });
  }

  if (!input.email?.trim() || input.email.trim() !== input.email || !input.email.includes("@")) {
    return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message: "Session email is required." });
  }

  if (!input.roleKey || !isRoleKey(input.roleKey)) {
    return serviceFailure({ code: "UNAUTHORIZED", message: "Session role is not allowed." });
  }

  if (!isProductionAuthProvider(input.provider)) {
    return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message: "Session provider is not allowed." });
  }

  if (!input.issuedAt || !input.expiresAt) {
    return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message: "Session timestamps are required." });
  }

  if (input.expiresAt <= now || input.expiresAt <= input.issuedAt) {
    return serviceFailure({ code: "UNAUTHORIZED", message: "Session is expired." });
  }

  return serviceSuccess({
    userId: input.userId,
    email: input.email,
    displayName: input.displayName ?? undefined,
    roleKey: input.roleKey,
    provider: input.provider,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt
  });
}

