# Admin Password Redirect Fix Review

Date: 2026-06-26

## Scope

Phase 7C fixes the admin password sign-in redirect discovered during Phase 7B staging smoke testing. No deployment, migration, database push, DNS change, custom domain change, secret change, live Microsoft Entra auth, UI save or production write is included in this fix.

## Bug

Phase 7B confirmed:

- Railway admin password environment variables were configured.
- Deployment `e4b205cd-c078-4bec-9d8d-ffc8cf7b7979` succeeded and was running.
- Password POST set the admin session cookie.
- Cookie-backed `/admin` loaded the read-only admin shell.
- The successful password redirect pointed to `https://localhost:8080/admin`.

The redirect was built from the incoming request URL, which can reflect Railway's internal runtime host rather than the public staging host.

## Fix

The successful password session route now returns a relative redirect:

```text
Location: /admin
```

This avoids trusting platform-internal hostnames and avoids leaking `localhost` into the browser redirect. Incorrect password behavior remains generic and unchanged.

## Safety Status

- Password access remains gated by environment variables.
- Session cookie behavior remains signed, httpOnly and sameSite `lax`.
- Password-session role remains `READ_ONLY_REVIEWER`.
- Public pages remain free of admin navigation links.
- Client and matter create pages remain blocked/non-writing for password-session access.
- Microsoft Entra live auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No migration was run.
- No `db:push` was run.
- No DNS or custom domain change was made.
- No password, session secret, Railway token or raw database URL is recorded.

## Next Phase

After review and merge, redeploy the Phase 7C fix to Railway staging and rerun Phase 7B-style admin password smoke checks.

## Phase 7D Staging Result

Date/time: 2026-06-26 14:21:16 SAST

Phase 7D deployed the merged redirect fix to Railway staging.

- Deployment ID: `5f07b9eb-c988-47d8-9758-29fbc99a4f86`
- Staging URL: `https://attorney-web-production.up.railway.app`
- Correct password POST: `303` with relative `Location: /admin`
- Correct password redirect contained `localhost`: no
- Cookie-backed `/admin`: rendered admin shell as `Read-Only Reviewer`
- `/admin/clients/new` and `/admin/matters/new`: remained blocked/disabled with no active save detected
- Microsoft Entra login/callback: remained disabled with `503`
- Migration: not run
- `db:push`: not run
- DNS/custom domain: not changed
- Secrets: not recorded

Residual note: incorrect-password POST still used the existing generic failure redirect and could include the internal request host, but it set no session cookie and granted no access. Phase 7E hardens that failure redirect to a relative path too.

## Phase 7E Failure Redirect Hardening

Date: 2026-06-26

Phase 7E updates incorrect-password and fail-closed password-session redirects to return:

```text
Location: /admin/sign-in?error=invalid
```

The failure path sets no session cookie, grants no access and no longer derives the redirect from the incoming request host.

## Phase 7F Deployed Verification

Date/time: 2026-06-26 15:44:04 SAST

Phase 7F records that the Phase 7E redirect hardening was manually deployed to Railway staging and verified without exposing secrets.

- Deployment ID: `468e1a25-4fe2-45d3-bbd8-a76ba4fefd59`
- Staging URL: `https://attorney-web-production.up.railway.app`
- Public routes: `/`, `/about`, `/services`, `/team`, `/testimonials`, `/contact` returned `200`
- Public admin links: not detected
- `/admin`: returned `200`
- Health check: `{"ok":true,"phase":"0","scope":"technical-foundation"}`
- User manual verification: admin password login works, admin shell loads and role badge shows `Read-Only Reviewer`
- Redirect behavior: correct password redirects to `/admin`; failure path is hardened to `/admin/sign-in?error=invalid`
- Create/write safety: `/admin/clients/new` and `/admin/matters/new` remain blocked/non-writing; no save/create/write flow is active
- Live Microsoft Entra auth: disabled
- UI saves and production writes: disabled/blocked
- Migration: not run
- `db:push`: not run
- Custom/production domain or DNS: not changed
- Secrets/cookies: not recorded
