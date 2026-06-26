# Admin Access Control

Date: 2026-06-26

## Current Model

The admin area has three distinct boundaries:

1. Public website navigation does not expose an admin link.
2. Phase 7A staging access requires a password session before admin shell content renders.
3. Existing role and write gates still decide what authenticated admin users may see or do.

The Phase 7A password gate is staging/review access only. It does not replace the accepted Microsoft Entra production auth direction.

## Password Gate

Supported environment variables:

```text
BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED=false
BURGESS_ADMIN_PASSWORD=
BURGESS_ADMIN_SESSION_SECRET=
```

Behavior:

- If `BURGESS_ADMIN_PASSWORD_ACCESS_ENABLED` is not `true`, admin password access is disabled.
- If `BURGESS_ADMIN_PASSWORD` is missing, access fails closed.
- If `BURGESS_ADMIN_SESSION_SECRET` is missing, access fails closed.
- The password is accepted only server-side.
- The session cookie is signed with `BURGESS_ADMIN_SESSION_SECRET`.
- The session cookie is `httpOnly`, `sameSite=lax`, scoped to `/admin` and secure when running in production mode.
- The password-session principal is `READ_ONLY_REVIEWER`.
- Successful password sign-in redirects with a relative `Location: /admin` header.
- The password sign-in route must not build the success redirect from internal platform hostnames such as `localhost`.

## Safety Boundaries

Password access does not enable:

- Microsoft Entra live login.
- Production auth readiness.
- UI saves.
- Client creation.
- Matter creation.
- Invoice creation.
- Production writes.
- Contact form submission backend.
- Migrations or database push commands.

The read-only reviewer role may view safe admin placeholders, but existing create-form access checks block client/matter create foundations for that principal. Create form controls remain disabled.

## Public Website Boundary

The public header and footer contain public navigation only:

```text
Home
About Us
Services
Our Team
Testimonials
Contact Us
```

No public navigation item links to `/admin`, `/admin/*` or `/admin/sign-in`.

## Future Production Auth

Microsoft Entra remains the accepted production auth direction. A future phase must validate tenant configuration, callback/session behavior, audit events and production-readiness gates before live Microsoft login or production writes can be enabled.

## Phase 7C Redirect Fix

Phase 7B staging smoke testing found that the password session was set correctly, but the successful redirect was built from Railway's internal request host and pointed to `https://localhost:8080/admin`. Phase 7C fixes the route to return a relative `/admin` redirect after successful password verification.

This fix does not change password validation, session signing, admin roles, Microsoft Entra behavior, write gates, database access, migrations, DNS or deployment state.

## Phase 7D Staging Verification

Phase 7D deployed the Phase 7C redirect fix to Railway staging deployment `5f07b9eb-c988-47d8-9758-29fbc99a4f86` on the `attorney-web` service.

Staging verification confirmed:

- Public pages load and do not expose admin navigation links.
- `/admin` without a session shows the password screen.
- Correct password sign-in returns `303` with relative `Location: /admin`.
- Correct password sign-in does not redirect to `localhost`.
- Cookie-backed `/admin` renders the read-only admin shell as `Read-Only Reviewer`.
- Client and matter create routes remain blocked/non-writing.
- Microsoft Entra live login remains disabled.

Phase 7D did not run a migration, `db:push`, DNS change, custom domain change, live auth enablement, UI save enablement or production write enablement.
