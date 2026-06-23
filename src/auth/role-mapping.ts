import { isRoleKey, type RoleKey } from "@/domain/roles";
import type { AuthProviderKind, AuthenticatedPrincipal } from "./auth-provider";
import type { AuthenticatedSession } from "./session";

function mapRoleKeys(roleKeys: readonly string[]): readonly RoleKey[] | null {
  if (roleKeys.length === 0) {
    return null;
  }

  if (!roleKeys.every(isRoleKey)) {
    return null;
  }

  return roleKeys;
}

export function mapSessionToPrincipal(
  session: AuthenticatedSession | null
): AuthenticatedPrincipal | null {
  if (!session) {
    return null;
  }

  const roles = mapRoleKeys(session.roleKeys);

  if (!roles) {
    return null;
  }

  return {
    userId: session.subject,
    email: session.email,
    roles,
    provider: session.provider
  };
}

export function createSession(
  input: Readonly<{
    subject: string;
    email: string;
    roleKeys: readonly string[];
    provider: AuthProviderKind;
  }>
): AuthenticatedSession {
  return {
    subject: input.subject,
    email: input.email,
    roleKeys: input.roleKeys,
    provider: input.provider
  };
}
