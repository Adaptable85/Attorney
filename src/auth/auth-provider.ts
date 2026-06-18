import type { RoleKey } from "@/domain/roles";

export type AuthProviderKind = "local_dev_placeholder" | "future_provider_backed";

export type AuthenticatedPrincipal = {
  userId: string;
  email: string;
  roles: readonly RoleKey[];
  provider: AuthProviderKind;
};

export type AuthProvider = {
  readonly kind: AuthProviderKind;
  getCurrentPrincipal(): Promise<AuthenticatedPrincipal | null>;
};

export function createLocalDevAuthProvider(
  principal: AuthenticatedPrincipal | null
): AuthProvider {
  return {
    kind: "local_dev_placeholder",
    async getCurrentPrincipal() {
      return principal;
    }
  };
}

