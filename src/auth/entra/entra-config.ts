import { buildEntraIssuer } from "./entra-issuer";
import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";

type EntraEnvironment = Partial<Record<string, string | undefined>>;

export type EntraAuthConfig = {
  provider: "microsoft_entra_id";
  tenantId: string;
  clientId: string;
  clientSecretConfigured: true;
  issuerUrl: string;
  openIdConfigurationUrl: string;
  redirectUri: string;
  allowedEmailDomains: readonly [string, ...string[]];
  roleClaimName: string;
};

export type EntraAuthConfigReadiness =
  | {
      ready: true;
      config: EntraAuthConfig;
    }
  | {
      ready: false;
      reason:
        | "provider_missing"
        | "provider_unknown"
        | "tenant_id_missing"
        | "tenant_id_invalid"
        | "client_id_missing"
        | "client_secret_missing"
        | "redirect_uri_missing"
        | "redirect_uri_invalid"
        | "allowed_email_domains_missing"
        | "allowed_email_domain_invalid"
        | "role_claim_missing"
        | "issuer_invalid";
      message: string;
    };

function fail(
  reason: Extract<EntraAuthConfigReadiness, { ready: false }>["reason"],
  message: string
): EntraAuthConfigReadiness {
  return { ready: false, reason, message };
}

function readProvider(environment: EntraEnvironment): string | undefined {
  return environment.AUTH_PROVIDER ?? environment.BURGESS_PRODUCTION_AUTH_PROVIDER;
}

function isEntraProvider(value: string | undefined): boolean {
  return value === "entra" || value === "microsoft_entra_id";
}

function readValue(environment: EntraEnvironment, primary: string, fallback?: string): string | undefined {
  return environment[primary] ?? (fallback ? environment[fallback] : undefined);
}

function isValidRedirectUri(value: string): boolean {
  try {
    const url = new URL(value);

    return (url.protocol === "https:" || url.hostname === "localhost") && value.trim() === value;
  } catch {
    return false;
  }
}

function parseAllowedEmailDomains(value: string | undefined): ServiceResult<readonly [string, ...string[]]> {
  if (!value?.trim()) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "At least one allowed Microsoft Entra email domain is required."
    });
  }

  const domains = value
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);

  const domainPattern = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

  if (domains.length === 0 || !domains.every((domain) => domainPattern.test(domain))) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Allowed Microsoft Entra email domains must be valid domain names."
    });
  }

  return serviceSuccess(domains as [string, ...string[]]);
}

function readIssuerUrl(environment: EntraEnvironment, tenantId: string): ServiceResult<{
  issuerUrl: string;
  openIdConfigurationUrl: string;
}> {
  const issuer = buildEntraIssuer(tenantId);

  if (!issuer.ok) {
    return serviceFailure({ code: "VALIDATION_ERROR", message: "Microsoft Entra tenant ID is invalid." });
  }

  const configuredIssuer = readValue(environment, "AUTH_ENTRA_ISSUER_URL", "BURGESS_PRODUCTION_AUTH_ISSUER_URL");

  if (!configuredIssuer) {
    return serviceSuccess({
      issuerUrl: issuer.data.issuerUrl,
      openIdConfigurationUrl: issuer.data.openIdConfigurationUrl
    });
  }

  if (configuredIssuer !== issuer.data.issuerUrl) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "Microsoft Entra issuer URL must match the configured tenant."
    });
  }

  return serviceSuccess({
    issuerUrl: configuredIssuer,
    openIdConfigurationUrl: issuer.data.openIdConfigurationUrl
  });
}

export function readEntraAuthConfig(
  environment: EntraEnvironment = process.env
): EntraAuthConfigReadiness {
  const provider = readProvider(environment);

  if (!provider) {
    return fail("provider_missing", "Microsoft Entra auth provider is not configured.");
  }

  if (!isEntraProvider(provider)) {
    return fail("provider_unknown", "Configured auth provider is not Microsoft Entra.");
  }

  const tenantId = readValue(
    environment,
    "AUTH_ENTRA_TENANT_ID",
    "BURGESS_PRODUCTION_AUTH_TENANT_ID"
  );
  const clientId = readValue(
    environment,
    "AUTH_ENTRA_CLIENT_ID",
    "BURGESS_PRODUCTION_AUTH_CLIENT_ID"
  );
  const clientSecret = readValue(
    environment,
    "AUTH_ENTRA_CLIENT_SECRET",
    "BURGESS_PRODUCTION_AUTH_CLIENT_SECRET"
  );
  const redirectUri = readValue(
    environment,
    "AUTH_ENTRA_REDIRECT_URI",
    "BURGESS_PRODUCTION_AUTH_REDIRECT_URI"
  );
  const roleClaimName = readValue(
    environment,
    "AUTH_ENTRA_ROLE_CLAIM",
    "BURGESS_PRODUCTION_AUTH_ROLE_CLAIM"
  );

  if (!tenantId?.trim()) {
    return fail("tenant_id_missing", "Microsoft Entra tenant ID is required.");
  }

  const issuer = readIssuerUrl(environment, tenantId);

  if (!issuer.ok) {
    return fail("tenant_id_invalid", issuer.error.message);
  }

  if (!clientId?.trim()) {
    return fail("client_id_missing", "Microsoft Entra client ID is required.");
  }

  if (!clientSecret?.trim()) {
    return fail("client_secret_missing", "Microsoft Entra client secret must be configured outside Git.");
  }

  if (!redirectUri?.trim()) {
    return fail("redirect_uri_missing", "Microsoft Entra redirect URI is required.");
  }

  if (!isValidRedirectUri(redirectUri)) {
    return fail("redirect_uri_invalid", "Microsoft Entra redirect URI is invalid.");
  }

  const domains = parseAllowedEmailDomains(
    readValue(
      environment,
      "AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS",
      "BURGESS_PRODUCTION_AUTH_ALLOWED_EMAIL_DOMAIN"
    )
  );

  if (!domains.ok) {
    return fail(
      domains.error.message.includes("At least one")
        ? "allowed_email_domains_missing"
        : "allowed_email_domain_invalid",
      domains.error.message
    );
  }

  if (!roleClaimName?.trim()) {
    return fail("role_claim_missing", "Microsoft Entra role claim name is required.");
  }

  return {
    ready: true,
    config: {
      provider: "microsoft_entra_id",
      tenantId,
      clientId,
      clientSecretConfigured: true,
      issuerUrl: issuer.data.issuerUrl,
      openIdConfigurationUrl: issuer.data.openIdConfigurationUrl,
      redirectUri,
      allowedEmailDomains: domains.data,
      roleClaimName
    }
  };
}

