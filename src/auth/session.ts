import type { AuthProvider, AuthProviderKind } from "./auth-provider";
import { mapSessionToPrincipal } from "./role-mapping";

export type AuthenticatedSession = {
  subject: string;
  email: string;
  roleKeys: readonly string[];
  provider: AuthProviderKind;
};

export function createSessionAuthProvider(
  session: AuthenticatedSession | null
): AuthProvider {
  return {
    kind: session?.provider ?? "future_provider_backed",
    async getCurrentPrincipal() {
      return mapSessionToPrincipal(session);
    }
  };
}
