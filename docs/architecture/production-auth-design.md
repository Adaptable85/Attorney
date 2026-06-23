# Production Auth Design

Status: Phase 4F Microsoft Entra JWT/JWKS verification skeleton
Date: 2026-06-23

## Current Auth State

The platform has a provider-neutral auth boundary, session-to-principal mapping and local/dev placeholder auth. Unknown role keys fail closed. The local/dev current-user helper is disabled in production.

Approved direction: Microsoft Entra ID / Microsoft 365 identity. No production provider secrets are configured in the repository.

Phase 3F adds a provider-neutral production auth adapter boundary and readiness helpers. The boundary defines supported provider categories and maps provider claims into internal principals only after readiness checks pass. It still does not configure a real provider or commit secrets.

Phase 3G kept production auth provider selection pending. Dev-only mutation functions rely on local/dev auth principals and do not count as production auth readiness.

Phase 3J added `docs/architecture/production-auth-provider-decision-pack.md`. Phase 3K.1 accepts Microsoft Entra ID / Microsoft 365 identity as the provider direction in ADR 0007. This does not enable production auth readiness.

Phase 4A adds a Microsoft Entra implementation skeleton under `src/auth/entra`. It parses placeholder-safe config, builds issuer URLs, maps Entra-like claims and exposes an adapter skeleton. It does not perform OAuth token exchange, create sessions, add route handlers, add secrets, enable production auth readiness or enable writes.

Phase 4B adds staging setup documentation, callback/session architecture, disabled Entra login/callback/logout route placeholders and future session shape validation. The routes return `entra_auth_not_enabled` JSON responses. They do not redirect to Microsoft, exchange tokens, create cookies, create sessions, enable production auth readiness or enable writes.

Phase 4C adds OAuth state/nonce helpers, PKCE helpers, JWKS URL descriptors and a token-validation skeleton. The token skeleton validates expected claim shape and still fails with cryptographic verification required for otherwise complete placeholder tokens. It does not fetch JWKS metadata, verify signatures, authenticate users, enable routes, create sessions or enable writes.

Phase 4D adds OAuth state storage and JWKS cache boundaries without live routes, cookies, sessions, default Microsoft network fetches or authenticated token acceptance.

Phase 4E adds disabled-by-default staging dependency wiring for Entra config, state storage, JWKS cache, PKCE and token-validation markers. It still does not enable live login, route redirects, token exchange, session cookies, production auth readiness or production writes.

Phase 4F adds JWT/JWKS key-selection and verifier boundaries. The boundary has no default verifier, no Microsoft network fetch and no production JWT library dependency yet. Decode-only claims remain untrusted.

## Production Auth Requirements

- Auth must produce a stable subject ID and verified email.
- Auth must map roles only through explicit Burgess role keys.
- Unknown, missing or duplicated role claims must fail closed.
- Sessions must be server-validated before any mutation entrypoint runs.
- Session expiration, revocation and inactivity behavior must be reviewed.
- Owner/principal attorney approval powers must never be granted by default.
- Agent/service accounts must remain draft-only.

## Role Mapping Requirements

- `OWNER_PRINCIPAL`: full owner/principal powers, including future approval powers.
- `SUPPORT_ADMIN`: preparation/support powers only, no owner approval by default.
- `AGENT_SERVICE`: draft/service actions only, no normal admin mutation writes.
- `READ_ONLY_REVIEWER`: read-only review access, no create mutations.

Any future role override must be explicit, tested and audit logged.

## MFA Recommendation

Production auth should require MFA for all human users. Owner/principal accounts and support admin accounts should require phishing-resistant MFA where practical.

## Session Security Requirements

- Secure, HTTP-only cookies where cookies are used.
- CSRF protection for browser-submitted mutations.
- Server-side authorization on every protected route/action.
- Short-lived sessions or refresh-token rotation.
- Audit logging for login, failed login and permission changes.
- No secrets in Git.

## Provider Options

Provider direction is accepted:

- Microsoft Entra ID / Microsoft 365 identity.

Still pending before implementation:

- Confirm Burgess Microsoft 365 tenant/admin access.
- Confirm MFA availability and enforcement.
- Confirm allowed users/domains.
- Confirm role claim approach.
- Confirm break-glass admin process.
- Configure environment variables outside Git.
- Complete staging validation.
- Select and review a JWT/JWKS verification library.
- Complete production readiness review.

Options reviewed:

- Microsoft Entra ID / Microsoft 365 identity if Burgess Attorneys already uses Microsoft accounts.
- Auth0 or Clerk for managed auth and MFA.
- NextAuth/Auth.js with a reviewed provider configuration.
- A provider-managed legal/compliance-friendly identity platform if required.

No live provider integration or secret is added by this phase.

The Phase 3J decision pack compares Auth.js, Clerk, Supabase Auth, Microsoft Entra ID and Auth0-style managed identity providers.

## Why Production Auth Blocks Live Writes

Live writes create or mutate sensitive legal-admin records. Without production auth, the platform cannot prove actor identity, role assignment, MFA posture, session security or revocation behavior. Therefore live writes must remain disabled until production auth is selected, configured and tested.

## Required Tests Before Writes

- Session maps to principal with allowed role.
- Unknown roles fail closed.
- Missing user fails closed.
- Production auth readiness defaults false.
- Local/dev auth does not count as production auth readiness.
- Provider claims map only through the explicit adapter boundary.
- Agent and read-only users cannot create client/matter records.
- Support admin can create only when policy permits.
- Owner can create only when release gate permits.
- Mutation entrypoint requires service context, permission, audit metadata and transaction boundary.
- Feature/release gates default off.

## Secrets / Config Rules

Never commit:

- Provider client secrets.
- Signing secrets.
- OAuth private keys.
- Production database URLs.
- Session encryption keys.
- MFA recovery codes.

All production secrets must live in approved secret storage.

## Rollout Plan

1. Select provider through a reviewed decision.
2. Add provider-specific skeleton and fail-closed tests.
3. Configure staging auth with fake/test users only.
4. Verify role mapping and fail-closed behavior.
5. Enable staging-only mutation gates.
6. Run security review.
7. Record release approval.
8. Enable production gates only after owner/principal approval.

## Rollback Plan

- Disable client/matter write feature flags.
- Revoke affected sessions.
- Rotate impacted secrets if needed.
- Review audit logs for attempted mutations.
- Keep create forms disabled until incident review is complete.
