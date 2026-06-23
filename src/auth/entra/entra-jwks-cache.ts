import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";

export type EntraJwksMetadata = {
  issuerUrl: string;
  jwksUrl: string;
  keyIds: readonly string[];
  fetchedAt: Date;
  expiresAt: Date;
};

export type EntraJwksFetcher = (issuerUrl: string) => Promise<ServiceResult<EntraJwksMetadata>>;

export type EntraJwksCache = {
  get(issuerUrl: string, now?: Date): Promise<ServiceResult<EntraJwksMetadata>>;
  put(metadata: EntraJwksMetadata): Promise<ServiceResult<void>>;
  refresh(issuerUrl: string, fetcher?: EntraJwksFetcher, now?: Date): Promise<ServiceResult<EntraJwksMetadata>>;
};

function validateMetadata(
  metadata: EntraJwksMetadata,
  expectedIssuerUrl: string,
  now: Date
): ServiceResult<EntraJwksMetadata> {
  if (metadata.issuerUrl !== expectedIssuerUrl) {
    return serviceFailure({
      code: "UNAUTHORIZED",
      message: "Microsoft Entra JWKS issuer is not allowed."
    });
  }

  if (metadata.expiresAt <= now || metadata.expiresAt <= metadata.fetchedAt) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Microsoft Entra JWKS metadata is expired."
    });
  }

  if (metadata.keyIds.length === 0) {
    return serviceFailure({
      code: "SERVICE_CONTEXT_ERROR",
      message: "Microsoft Entra JWKS metadata has no keys."
    });
  }

  return serviceSuccess(metadata);
}

export function createInMemoryEntraJwksCache(initialMetadata?: readonly EntraJwksMetadata[]): EntraJwksCache {
  const cache = new Map<string, EntraJwksMetadata>();

  for (const metadata of initialMetadata ?? []) {
    cache.set(metadata.issuerUrl, metadata);
  }

  return {
    async get(issuerUrl, now = new Date()) {
      const metadata = cache.get(issuerUrl);

      if (!metadata) {
        return serviceFailure({
          code: "SERVICE_CONTEXT_ERROR",
          message: "Microsoft Entra JWKS metadata is unavailable."
        });
      }

      return validateMetadata(metadata, issuerUrl, now);
    },
    async put(metadata) {
      const validation = validateMetadata(metadata, metadata.issuerUrl, metadata.fetchedAt);

      if (!validation.ok) {
        return validation;
      }

      cache.set(metadata.issuerUrl, metadata);

      return serviceSuccess(undefined);
    },
    async refresh(issuerUrl, fetcher, now = new Date()) {
      if (!fetcher) {
        return serviceFailure({
          code: "SERVICE_CONTEXT_ERROR",
          message: "Microsoft Entra JWKS fetcher is not configured."
        });
      }

      const fetched = await fetcher(issuerUrl);

      if (!fetched.ok) {
        return fetched;
      }

      const validation = validateMetadata(fetched.data, issuerUrl, now);

      if (!validation.ok) {
        return validation;
      }

      cache.set(issuerUrl, validation.data);

      return validation;
    }
  };
}

