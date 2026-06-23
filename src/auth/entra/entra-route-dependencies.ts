import {
  createEntraStagingWiring,
  type CreateEntraStagingWiringOptions,
  type EntraStagingWiring
} from "./entra-staging-wiring";

export type DisabledEntraRouteDependencies = {
  routeBehavior: "disabled";
  reason: "entra_auth_not_enabled";
  wiring: EntraStagingWiring;
  cookiesEnabled: false;
  sessionsEnabled: false;
  redirectsEnabled: false;
  tokenExchangeEnabled: false;
};

export function createDisabledEntraRouteDependencies(
  options: CreateEntraStagingWiringOptions = {}
): DisabledEntraRouteDependencies {
  return {
    routeBehavior: "disabled",
    reason: "entra_auth_not_enabled",
    wiring: createEntraStagingWiring(options),
    cookiesEnabled: false,
    sessionsEnabled: false,
    redirectsEnabled: false,
    tokenExchangeEnabled: false
  };
}
