import type { AuthenticatedPrincipal } from "@/auth/auth-provider";

export type StagingClientFileWriteDecision =
  | {
      enabled: true;
      reason: "enabled_for_staging_password_admin";
    }
  | {
      enabled: false;
      reason:
        | "staging_client_file_writes_disabled"
        | "staging_password_admin_required";
    };

export function readStagingClientFileWritesEnabled(
  environment: Partial<Record<string, string | undefined>> = process.env
): boolean {
  return environment.BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED === "true";
}

export function evaluateStagingClientFileWriteGate(
  principal: AuthenticatedPrincipal | null,
  environment: Partial<Record<string, string | undefined>> = process.env
): StagingClientFileWriteDecision {
  if (!readStagingClientFileWritesEnabled(environment)) {
    return {
      enabled: false,
      reason: "staging_client_file_writes_disabled"
    };
  }

  if (!principal || principal.provider !== "staging_admin_password") {
    return {
      enabled: false,
      reason: "staging_password_admin_required"
    };
  }

  return {
    enabled: true,
    reason: "enabled_for_staging_password_admin"
  };
}
