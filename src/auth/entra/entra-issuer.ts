import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";

const microsoftLoginHost = "https://login.microsoftonline.com";
const uuidTenantPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const domainTenantPattern = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export type EntraIssuer = {
  tenantId: string;
  issuerUrl: string;
  openIdConfigurationUrl: string;
};

export function isValidEntraTenantId(value: string): boolean {
  const trimmed = value.trim();

  return trimmed === value && (uuidTenantPattern.test(value) || domainTenantPattern.test(value));
}

export function buildEntraIssuer(tenantId: string): ServiceResult<EntraIssuer> {
  if (!isValidEntraTenantId(tenantId)) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Microsoft Entra tenant ID is invalid."
    });
  }

  const issuerUrl = `${microsoftLoginHost}/${tenantId}/v2.0`;

  return serviceSuccess({
    tenantId,
    issuerUrl,
    openIdConfigurationUrl: `${issuerUrl}/.well-known/openid-configuration`
  });
}

