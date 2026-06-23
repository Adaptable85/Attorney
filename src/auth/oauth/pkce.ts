import { createHash, randomBytes } from "node:crypto";

import { type ServiceResult, serviceFailure, serviceSuccess } from "@/services/service-result";

const verifierPattern = /^[A-Za-z0-9._~-]{43,128}$/;

export function generatePkceVerifier(bytes = 64): string {
  return randomBytes(bytes).toString("base64url").slice(0, 128);
}

export function validatePkceVerifier(verifier: string): ServiceResult<string> {
  if (!verifierPattern.test(verifier)) {
    return serviceFailure({
      code: "VALIDATION_ERROR",
      message: "PKCE verifier is invalid."
    });
  }

  return serviceSuccess(verifier);
}

export function createPkceChallenge(verifier: string): ServiceResult<{
  method: "S256";
  challenge: string;
}> {
  const validVerifier = validatePkceVerifier(verifier);

  if (!validVerifier.ok) {
    return validVerifier;
  }

  return serviceSuccess({
    method: "S256",
    challenge: createHash("sha256").update(validVerifier.data).digest("base64url")
  });
}

