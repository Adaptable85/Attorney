import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";
import { buildEntraIssuer } from "./entra-issuer";

export type EntraJwksDescriptor = {
  issuerUrl: string;
  jwksUrl: string;
};

export function buildEntraJwksDescriptor(tenantId: string): ServiceResult<EntraJwksDescriptor> {
  const issuer = buildEntraIssuer(tenantId);

  if (!issuer.ok) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Microsoft Entra tenant ID is invalid."
    });
  }

  return serviceSuccess({
    issuerUrl: issuer.data.issuerUrl,
    jwksUrl: `${issuer.data.issuerUrl}/discovery/v2.0/keys`
  });
}

