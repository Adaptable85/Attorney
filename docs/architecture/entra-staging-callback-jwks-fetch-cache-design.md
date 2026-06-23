# Entra Staging Callback And JWKS Fetch-Cache Design

Status: Phase 4H design only
Date: 2026-06-23

Phase 4H defines the reviewed staging design for real Microsoft Entra callback handling and JWKS fetch/cache behavior. It does not enable routes, redirects, token exchange, cookies, sessions, default Microsoft network calls, production auth readiness, UI saves or production writes.

## Real Callback Flow Design

1. A future enabled login route verifies staging auth is explicitly enabled and production writes remain disabled.
2. The route creates a random `state`, random `nonce`, PKCE verifier/challenge and a narrow post-login redirect target.
3. The route stores transient OAuth metadata in the reviewed state store with a short expiry and one-time consume semantics.
4. The route redirects to the Microsoft Entra authorization endpoint with authorization code flow, PKCE challenge, expected scopes and configured redirect URI.
5. Microsoft returns to the callback route with `code` and `state`.
6. The callback consumes the stored state record exactly once.
7. The callback exchanges the authorization code for tokens through a reviewed token-exchange adapter.
8. The callback validates the ID token with cached JWKS metadata and the `jose` verifier adapter.
9. Verified claims map through the Entra claim mapper and fail closed for unknown roles, disallowed domains or missing subject/email.
10. A reviewed session adapter creates the application session.
11. The callback writes a safe audit event and redirects to the allowed application route.

## State And Nonce Validation Sequence

1. Reject missing `state`, duplicate `state`, expired `state` or state records for another provider.
2. Consume state before token exchange so replayed callbacks fail closed.
3. Validate stored redirect target against the allowlist before any redirect.
4. Bind callback processing to the stored `nonce`.
5. Validate the verified ID token nonce equals the stored nonce.
6. Delete or mark the state record consumed after success or terminal failure.
7. Emit failed-login audit metadata for mismatches without logging raw token values.

## PKCE Verification Sequence

1. Generate a high-entropy verifier at login.
2. Store only transient metadata required for the callback.
3. Send the S256 challenge and method to Microsoft.
4. Use the original verifier only during token exchange.
5. Refuse callback handling if the verifier is missing, expired or already consumed.
6. Do not log the verifier, authorization code or token response.

## JWKS Metadata Fetch Plan

- Fetch OpenID metadata and JWKS only through an injectable fetch adapter.
- Use the configured tenant issuer and OpenID configuration URL; never accept issuer URLs from tokens.
- Require HTTPS Microsoft metadata endpoints.
- Enforce response size and parse limits.
- Require a JWKS document with supported RSA signing keys.
- Refuse keys without `kid`, unsupported `kty`, unsupported `use` or unsupported `alg`.
- Never fetch JWKS during module import or normal disabled-route rendering.

## JWKS Cache Expiry And Rotation Plan

- Cache JWKS metadata by issuer and tenant.
- Respect reviewed `cache-control`/expiry values with an upper bound chosen during implementation.
- Use a conservative default expiry if Microsoft metadata omits cache headers.
- On unknown `kid`, refresh once and retry verification once.
- If the refreshed JWKS still lacks the key, fail closed.
- If metadata fetch fails but a non-expired cache entry exists, continue only within the reviewed freshness window.
- If metadata fetch fails and no fresh cache exists, fail closed and emit a failed-login audit event.
- Keep duplicate `kid` detection fail-closed before verification.

## `jose` Verification Wiring Plan

- Convert cached Microsoft JWK material into the existing `jose` verifier input.
- Allow only `RS256` unless a future reviewed Entra setting explicitly changes the allowlist.
- Pass expected issuer, audience/client ID, tenant ID and nonce to the verifier.
- Treat verifier failure as authentication failure, not as a recoverable partial login.
- Return only normalized verified claims to claim mapping.
- Keep raw ID tokens, access tokens and refresh tokens out of logs and audit payloads.

## Error And Fail-Closed Cases

- Auth disabled or staging flag missing.
- Missing, expired, already-consumed or mismatched state.
- Missing, expired or mismatched nonce.
- Missing authorization code.
- Token exchange error.
- Missing OpenID metadata or JWKS.
- Unsupported algorithm or key type.
- Missing, unknown or duplicate `kid`.
- Invalid signature, issuer, audience, tenant, expiry or not-before.
- Missing subject or email.
- Disallowed email domain.
- Unknown or duplicated role claim.
- Session creation failure.

All errors must return safe user-facing messages and avoid exposing secrets, raw provider payloads, authorization codes or token values.

## Audit Events

Future live auth should emit safe audit events for:

- `login`: successful session creation with provider, normalized user ID, role key and request metadata.
- `failed_login`: disabled auth, state/nonce failure, token exchange failure, JWKS failure, verifier failure, claim mapping failure or session failure.
- `logout`: session cleared, with provider and principal if known.

Audit metadata must not include tokens, authorization codes, PKCE verifiers, secrets or raw Microsoft payloads.

## Staging-Only Validation Checklist

- Confirm staging app registration, redirect URI and tenant values are configured outside Git.
- Confirm staging users and roles are fake/test or approved non-sensitive accounts.
- Confirm MFA policy and break-glass access are documented.
- Verify disabled routes still return disabled responses until the live-auth phase explicitly enables them.
- Verify state replay, expired state and mismatched nonce fail closed.
- Verify unknown `kid` refreshes cache once and then fails closed if still absent.
- Verify JWKS outage behavior with fresh cache, stale cache and empty cache.
- Verify successful staging login creates only a reviewed session and audit event.
- Verify production writes remain disabled after staging login.

## Production Readiness Checklist

- Owner/principal approval for production auth enablement.
- Confirm tenant/admin access, allowed users/domains and role claim process.
- Confirm secret storage, rotation and incident response.
- Confirm monitoring and audit review process.
- Confirm logout and session expiry behavior.
- Confirm fallback/rollback process.
- Confirm production writes remain separately gated.
- Complete security review before production readiness flags can change.

## Rollback Plan

- Disable the staging auth flag.
- Keep route placeholders capable of returning disabled responses.
- Clear transient state/cache entries if needed.
- Revoke or rotate Entra app secrets if compromise is suspected.
- Review failed-login audit events for replay, nonce or JWKS failures.
- Keep local/dev placeholder auth available for non-production development while production auth remains disabled.

## Security Review Checklist

- No secrets in Git.
- No tokens, codes or PKCE verifiers in logs.
- HTTPS-only metadata endpoints.
- Strict issuer, audience, tenant, nonce and expiry validation.
- Fail-closed role and domain mapping.
- One-time state consumption.
- Cache bounds and duplicate key refusal.
- Safe audit payloads only.
- No production write enablement from auth success alone.

## Why Routes Remain Disabled Now

- No live token-exchange adapter has been implemented.
- No reviewed session cookie writer has been implemented.
- No real Microsoft secrets have been configured.
- JWKS fetch/cache behavior is documented here but not wired to routes.
- Staging validation has not been executed.
- Production readiness review has not been completed.
- Production writes and UI saves require separate approval gates and remain disabled.
