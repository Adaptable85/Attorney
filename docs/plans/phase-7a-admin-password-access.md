# Phase 7A - Admin Password Access

Date: 2026-06-26

## Scope

Phase 7A adds a staging/review-only password gate for the Attorney admin area. It does not enable Microsoft Entra live auth, UI saves, production writes, client creation, matter creation, invoice workflows, WhatsApp, Lexpro, migrations, deployment, custom domains or DNS changes.

## Acceptance Criteria

- Public pages do not show links to `/admin`, `/admin/*` or `/admin/sign-in`.
- `/admin` does not expose admin shell content without a valid staging password session.
- Staging password access is disabled by default.
- Missing password or session-secret environment variables fail closed.
- Correct password creates a signed, httpOnly, sameSite `lax` admin session cookie only when the explicit gate is enabled.
- Correct password redirects to relative `/admin`, not an absolute internal host.
- Password session maps to `READ_ONLY_REVIEWER`.
- Read-only admin pages may render after password access.
- Client and matter create foundations remain blocked for the password-session reviewer.
- No active contact form backend is added.

## Environment Variables

These names are supported but real values must be configured outside Git:

```text
BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED=false
BURGESS_ADMIN_PASSWORD=
BURGESS_ADMIN_SESSION_SECRET=
```

The following gates must remain false unless a later approved phase changes them:

```text
AUTH_PRODUCTION_READY=false
BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false
BURGESS_CLIENT_MATTER_WRITES_ENABLED=false
BURGESS_LOCAL_DEV_WRITES_ENABLED=false
BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false
BURGESS_PRODUCTION_WRITES_ENABLED=false
```

## Validation

Required validation:

```sh
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run prisma:validate
pnpm run build
./scripts/check-agent-context.sh
./scripts/check-adr-needed.sh
./scripts/pre-pr-review.sh
pnpm run test:db:local
```

## Next Phase

Phase 7B configured Railway password environment variables and deployed the password gate, but staging smoke testing found the successful redirect pointed at an internal `localhost` URL. Phase 7C fixes the redirect to relative `/admin`.

After Phase 7C review and merge, redeploy in a separate approved phase and rerun the admin password smoke check. Do not put password values in Git or chat.
