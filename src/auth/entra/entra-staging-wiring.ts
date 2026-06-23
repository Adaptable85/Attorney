import {
  createPkceChallenge,
  generatePkceVerifier,
  validatePkceVerifier
} from "@/auth/oauth/pkce";
import {
  createInMemoryOAuthStateStore,
  type OAuthStateStore
} from "@/auth/oauth/oauth-state-store";
import { readFeatureFlags } from "@/config/feature-flags";

import { type EntraAuthConfig, readEntraAuthConfig } from "./entra-config";
import {
  createInMemoryEntraJwksCache,
  type EntraJwksCache
} from "./entra-jwks-cache";
import { validateEntraTokenSkeleton } from "./entra-token-validation";

type StagingWiringEnvironment = Partial<Record<string, string | undefined>>;

export type EntraStagingWiringDisabledReason =
  | "staging_wiring_disabled"
  | "config_missing"
  | "crypto_verification_missing";

export type EntraStagingWiringDisabled = {
  enabled: false;
  reason: EntraStagingWiringDisabledReason;
  message: string;
  liveLoginEnabled: false;
  productionAuthReady: false;
  productionWritesEnabled: false;
};

export type EntraStagingWiringBundle = {
  enabled: true;
  config: EntraAuthConfig;
  stateStore: OAuthStateStore;
  jwksCache: EntraJwksCache;
  pkce: {
    generateVerifier: typeof generatePkceVerifier;
    validateVerifier: typeof validatePkceVerifier;
    createChallenge: typeof createPkceChallenge;
  };
  tokenValidation: {
    dependencyAvailable: true;
    authenticatesTokens: false;
    validate: typeof validateEntraTokenSkeleton;
  };
  liveLoginEnabled: false;
  productionAuthReady: false;
  productionWritesEnabled: false;
};

export type EntraStagingWiring = EntraStagingWiringDisabled | EntraStagingWiringBundle;

export type CreateEntraStagingWiringOptions = {
  environment?: StagingWiringEnvironment;
  cryptoVerificationDependencyAvailable?: boolean;
  stateStore?: OAuthStateStore;
  jwksCache?: EntraJwksCache;
};

function disabled(
  reason: EntraStagingWiringDisabledReason,
  message: string
): EntraStagingWiringDisabled {
  return {
    enabled: false,
    reason,
    message,
    liveLoginEnabled: false,
    productionAuthReady: false,
    productionWritesEnabled: false
  };
}

export function createEntraStagingWiring(
  options: CreateEntraStagingWiringOptions = {}
): EntraStagingWiring {
  const environment = options.environment ?? process.env;
  const flags = readFeatureFlags(environment);

  if (!flags.entraStagingAuthWiringEnabled) {
    return disabled(
      "staging_wiring_disabled",
      "Microsoft Entra staging auth wiring is disabled."
    );
  }

  const config = readEntraAuthConfig(environment);

  if (!config.ready) {
    return disabled("config_missing", config.message);
  }

  if (options.cryptoVerificationDependencyAvailable !== true) {
    return disabled(
      "crypto_verification_missing",
      "Microsoft Entra cryptographic token verification dependency is not configured."
    );
  }

  return {
    enabled: true,
    config: config.config,
    stateStore: options.stateStore ?? createInMemoryOAuthStateStore(),
    jwksCache: options.jwksCache ?? createInMemoryEntraJwksCache(),
    pkce: {
      generateVerifier: generatePkceVerifier,
      validateVerifier: validatePkceVerifier,
      createChallenge: createPkceChallenge
    },
    tokenValidation: {
      dependencyAvailable: true,
      authenticatesTokens: false,
      validate: validateEntraTokenSkeleton
    },
    liveLoginEnabled: false,
    productionAuthReady: false,
    productionWritesEnabled: false
  };
}
