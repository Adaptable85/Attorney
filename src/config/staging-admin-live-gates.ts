import type { AuthenticatedPrincipal } from "@/auth/auth-provider";

type StagingGateReason =
  | "staging_gate_disabled"
  | "staging_password_admin_required";

export type StagingAdminLiveGateDecision =
  | {
      enabled: true;
      reason: "enabled_for_staging_password_admin";
    }
  | {
      enabled: false;
      reason: StagingGateReason;
    };

function evaluateBooleanStagingGate(options: {
  principal: AuthenticatedPrincipal | null;
  environment: Partial<Record<string, string | undefined>>;
  variableName: string;
}): StagingAdminLiveGateDecision {
  if (options.environment[options.variableName] !== "true") {
    return {
      enabled: false,
      reason: "staging_gate_disabled"
    };
  }

  if (!options.principal || options.principal.provider !== "staging_admin_password") {
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

export function evaluateStagingDocumentUploadGate(
  principal: AuthenticatedPrincipal | null,
  environment: Partial<Record<string, string | undefined>> = process.env
): StagingAdminLiveGateDecision {
  return evaluateBooleanStagingGate({
    principal,
    environment,
    variableName: "BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED"
  });
}

export function evaluateStagingBillingItemsGate(
  principal: AuthenticatedPrincipal | null,
  environment: Partial<Record<string, string | undefined>> = process.env
): StagingAdminLiveGateDecision {
  return evaluateBooleanStagingGate({
    principal,
    environment,
    variableName: "BURGESS_STAGING_BILLING_ITEMS_ENABLED"
  });
}

export function evaluateStagingMatterWritesGate(
  principal: AuthenticatedPrincipal | null,
  environment: Partial<Record<string, string | undefined>> = process.env
): StagingAdminLiveGateDecision {
  return evaluateBooleanStagingGate({
    principal,
    environment,
    variableName: "BURGESS_STAGING_MATTER_WRITES_ENABLED"
  });
}
