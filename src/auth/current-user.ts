import {
  type AuthenticatedPrincipal,
  type AuthProvider,
  createLocalDevAuthProvider
} from "./auth-provider";
import type { RoleKey } from "@/domain/roles";

function isSupportedDevRole(value: string | undefined): value is RoleKey {
  return (
    value === "OWNER_PRINCIPAL" ||
    value === "SUPPORT_ADMIN" ||
    value === "AGENT_SERVICE" ||
    value === "READ_ONLY_REVIEWER"
  );
}

export function getLocalDevPrincipal(): AuthenticatedPrincipal | null {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const devRoleFromEnv = process.env.BURGESS_DEV_CURRENT_ROLE;

  if (devRoleFromEnv === "none") {
    return null;
  }

  const role = isSupportedDevRole(devRoleFromEnv) ? devRoleFromEnv : "SUPPORT_ADMIN";

  return {
    userId: `local_dev_${role.toLowerCase()}`,
    email: "local.dev.admin@example.test",
    roles: [role],
    provider: "local_dev_placeholder"
  };
}

export function createCurrentUserProvider(): AuthProvider {
  return createLocalDevAuthProvider(getLocalDevPrincipal());
}

export async function getCurrentPrincipal(
  provider: AuthProvider = createCurrentUserProvider()
): Promise<AuthenticatedPrincipal | null> {
  return provider.getCurrentPrincipal();
}
