import {
  type AuthenticatedPrincipal,
  type AuthProvider,
  createLocalDevAuthProvider
} from "./auth-provider";
import { createSession } from "./role-mapping";
import { mapSessionToPrincipal } from "./role-mapping";

export function getLocalDevPrincipal(): AuthenticatedPrincipal | null {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const devRoleFromEnv = process.env.BURGESS_DEV_CURRENT_ROLE;

  if (devRoleFromEnv === "none") {
    return null;
  }

  const role = devRoleFromEnv ?? "SUPPORT_ADMIN";

  return mapSessionToPrincipal(createSession({
    subject: `local_dev_${role.toLowerCase()}`,
    email: "local.dev.admin@example.test",
    roleKeys: [role],
    provider: "local_dev_placeholder"
  }));
}

export function createCurrentUserProvider(): AuthProvider {
  return createLocalDevAuthProvider(getLocalDevPrincipal());
}

export async function getCurrentPrincipal(
  provider: AuthProvider = createCurrentUserProvider()
): Promise<AuthenticatedPrincipal | null> {
  return provider.getCurrentPrincipal();
}
