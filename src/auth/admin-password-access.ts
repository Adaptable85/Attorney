import { createHmac, createHash, timingSafeEqual } from "node:crypto";

import type { AuthenticatedPrincipal } from "./auth-provider";

export const adminPasswordSessionCookieName = "burgess_admin_session";

const sessionSubject = "staging_admin_password_reviewer";
const sessionEmail = "staging.admin.review@example.test";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type AdminPasswordAccessEnvironment = Record<string, string | undefined> & {
  BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED?: string;
  BURGESS_ADMIN_PASSWORD?: string;
  BURGESS_ADMIN_SESSION_SECRET?: string;
};

export type AdminPasswordAccessConfig =
  | {
      enabled: false;
      configured: false;
      reason: "password_access_disabled";
    }
  | {
      enabled: true;
      configured: false;
      reason: "password_access_unconfigured";
    }
  | {
      enabled: true;
      configured: true;
      password: string;
      sessionSecret: string;
    };

type AdminPasswordSessionPayload = {
  subject: typeof sessionSubject;
  issuedAt: number;
};

function trimEnvValue(value: string | undefined): string | null {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function constantTimeEquals(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();

  return timingSafeEqual(leftHash, rightHash);
}

export function getAdminPasswordAccessConfig(
  environment: AdminPasswordAccessEnvironment = process.env
): AdminPasswordAccessConfig {
  if (environment.BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED !== "true") {
    return {
      enabled: false,
      configured: false,
      reason: "password_access_disabled"
    };
  }

  const password = trimEnvValue(environment.BURGESS_ADMIN_PASSWORD);
  const sessionSecret = trimEnvValue(environment.BURGESS_ADMIN_SESSION_SECRET);

  if (!password || !sessionSecret) {
    return {
      enabled: true,
      configured: false,
      reason: "password_access_unconfigured"
    };
  }

  return {
    enabled: true,
    configured: true,
    password,
    sessionSecret
  };
}

export function createStagingAdminPasswordPrincipal(): AuthenticatedPrincipal {
  return {
    userId: sessionSubject,
    email: sessionEmail,
    roles: ["READ_ONLY_REVIEWER"],
    provider: "staging_admin_password"
  };
}

export function verifyAdminPassword(
  candidatePassword: string,
  config: AdminPasswordAccessConfig
): boolean {
  if (!config.enabled || !config.configured) {
    return false;
  }

  return constantTimeEquals(candidatePassword, config.password);
}

export function createAdminPasswordSessionCookieValue(
  config: AdminPasswordAccessConfig,
  now: Date = new Date()
): string | null {
  if (!config.enabled || !config.configured) {
    return null;
  }

  const payload = encodeBase64Url(JSON.stringify({
    subject: sessionSubject,
    issuedAt: now.getTime()
  } satisfies AdminPasswordSessionPayload));
  const signature = signPayload(payload, config.sessionSecret);

  return `${payload}.${signature}`;
}

export function verifyAdminPasswordSessionCookieValue(
  cookieValue: string | undefined,
  config: AdminPasswordAccessConfig,
  now: Date = new Date()
): AuthenticatedPrincipal | null {
  if (!cookieValue || !config.enabled || !config.configured) {
    return null;
  }

  const [payload, signature, extra] = cookieValue.split(".");

  if (!payload || !signature || extra) {
    return null;
  }

  if (!constantTimeEquals(signature, signPayload(payload, config.sessionSecret))) {
    return null;
  }

  const decoded = decodeBase64Url(payload);

  if (!decoded) {
    return null;
  }

  let parsed: Partial<AdminPasswordSessionPayload>;

  try {
    parsed = JSON.parse(decoded) as Partial<AdminPasswordSessionPayload>;
  } catch {
    return null;
  }

  if (parsed.subject !== sessionSubject || typeof parsed.issuedAt !== "number") {
    return null;
  }

  const ageSeconds = Math.floor((now.getTime() - parsed.issuedAt) / 1000);

  if (ageSeconds < 0 || ageSeconds > sessionMaxAgeSeconds) {
    return null;
  }

  return createStagingAdminPasswordPrincipal();
}

export function getAdminPasswordCookieOptions(environment = process.env.NODE_ENV) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: environment === "production",
    path: "/admin",
    maxAge: sessionMaxAgeSeconds
  };
}
