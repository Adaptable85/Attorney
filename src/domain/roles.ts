export const ROLE_KEYS = [
  "OWNER_PRINCIPAL",
  "SUPPORT_ADMIN",
  "AGENT_SERVICE",
  "READ_ONLY_REVIEWER"
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export function isRoleKey(value: string): value is RoleKey {
  return ROLE_KEYS.includes(value as RoleKey);
}

