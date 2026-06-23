# Entra OAuth State Storage Design

Status: Phase 4E storage boundary with disabled staging wiring
Date: 2026-06-23

Phase 4D adds state/nonce storage interfaces and an in-memory test adapter. It does not create cookies, sessions, database records or live login.

Phase 4E composes this state store through disabled-by-default staging wiring. The composition is a dependency bundle for future review only and does not wire state storage to route handlers, cookies, sessions or live login.

## State / Nonce Lifecycle

1. Future login flow creates a state and nonce payload.
2. Payload includes provider marker, redirect target, issued time and expiry.
3. Payload is stored through an `OAuthStateStore` boundary.
4. Callback consumes the state exactly once.
5. Consumed, expired or mismatched state fails closed.

## PKCE Lifecycle

1. Future login flow creates a verifier.
2. Challenge is derived with S256.
3. Verifier must be stored with the transient state record in a future phase.
4. Callback uses the verifier during token exchange.
5. Verifier must never be logged or stored in long-lived client-visible data.

## Intended Storage Later

Future implementation may use:

- Secure, HTTP-only, SameSite cookie for transient browser-bound state.
- Reviewed server-side store keyed by state.
- Hybrid cookie plus server-side record if replay protection requires it.

No live cookies are created in Phase 4D.

## Replay Prevention

- State consume must delete the record on success.
- Expired state consume must fail closed and delete the record.
- Missing state must fail closed.
- Reused state must fail closed.

## Expiry Policy

- State should be short-lived.
- Phase 4C helper default is ten minutes.
- Final staging policy must be reviewed before live auth.

## CSRF / State Validation

- State must match the provider marker.
- Nonce must be bound to the ID token later.
- Redirect target must be allowlisted.
- Unknown or malformed values fail closed.

## Database Dependency

Phase 4D storage requires no database. Production-grade storage choice remains future work.

## Staging Wiring

- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false` by default.
- Missing config fails closed.
- Missing cryptographic token verification dependency fails closed.
- Enabled staging wiring returns a state store dependency but does not enable route behavior.
- Production auth readiness and production writes remain false.

## Future Implementation Checklist

- Select cookie/server-side storage approach.
- Define state record schema if server-side storage is used.
- Bind PKCE verifier to the state record.
- Add secure cookie attributes if cookies are used.
- Add cleanup for expired state records.
- Add audit-safe failed-login metadata.
- Keep routes disabled until staging validation is complete.
