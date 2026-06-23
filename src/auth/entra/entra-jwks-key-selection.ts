import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";

export type EntraJwtAlgorithm = "RS256";

export type EntraJwksPublicKey = {
  kid?: string;
  kty: string;
  alg?: string;
  use?: string;
};

export type EntraJwksKeySelectionInput = {
  keys: readonly EntraJwksPublicKey[];
  kid?: string | null;
  algorithm?: string | null;
  allowedAlgorithms?: readonly EntraJwtAlgorithm[];
};

const defaultAllowedAlgorithms = ["RS256"] as const satisfies readonly EntraJwtAlgorithm[];

function fail(message: string): ServiceResult<never> {
  return serviceFailure({ code: "SERVICE_CONTEXT_ERROR", message });
}

export function allowedEntraJwtAlgorithms(): readonly EntraJwtAlgorithm[] {
  return defaultAllowedAlgorithms;
}

export function isAllowedEntraJwtAlgorithm(
  algorithm: string | null | undefined,
  allowedAlgorithms: readonly EntraJwtAlgorithm[] = defaultAllowedAlgorithms
): algorithm is EntraJwtAlgorithm {
  return allowedAlgorithms.includes(algorithm as EntraJwtAlgorithm);
}

export function selectEntraJwksKey(
  input: EntraJwksKeySelectionInput
): ServiceResult<EntraJwksPublicKey & { kid: string; alg: EntraJwtAlgorithm; kty: "RSA" }> {
  if (!input.kid?.trim()) {
    return fail("Microsoft Entra JWT key ID is required.");
  }

  if (!isAllowedEntraJwtAlgorithm(input.algorithm, input.allowedAlgorithms)) {
    return fail("Microsoft Entra JWT algorithm is not allowed.");
  }

  const matches = input.keys.filter((key) => key.kid === input.kid);

  if (matches.length === 0) {
    return fail("Microsoft Entra JWT signing key was not found.");
  }

  if (matches.length > 1) {
    return fail("Microsoft Entra JWT signing key ID is duplicated.");
  }

  const key = matches[0];

  if (key.kty !== "RSA") {
    return fail("Microsoft Entra JWT signing key type is not supported.");
  }

  if (key.alg && key.alg !== input.algorithm) {
    return fail("Microsoft Entra JWT signing key algorithm does not match.");
  }

  if (key.use && key.use !== "sig") {
    return fail("Microsoft Entra JWT signing key use is not supported.");
  }

  return serviceSuccess({
    ...key,
    kid: input.kid,
    alg: input.algorithm,
    kty: "RSA"
  });
}
