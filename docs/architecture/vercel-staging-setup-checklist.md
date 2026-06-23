# Vercel Staging Setup Checklist

Status: Phase 5C planning
Date: 2026-06-23

This checklist prepares Vercel staging setup only. It does not create a project, deploy the app, add secrets, enable live auth, enable UI saves or enable production writes.

## Project Recommendation

- Recommended Vercel project name: `burgess-attorneys-admin`.
- Project purpose: secure Next.js app/API for Burgess Attorneys admin automation.
- Access: approved maintainers only.
- Do not connect production domains until production deployment is approved.

## GitHub Connection Plan

- Connect the `Adaptable85/Attorney` repository after explicit approval.
- Use `main` as the production branch only after production deploy approval.
- Use reviewed PR branches for preview deployments.
- Disable or restrict unreviewed automatic production deploys if Vercel settings allow.
- Confirm the review branch policy before enabling previews.

## Staging Branch / Deployment Strategy

- Use a dedicated staging environment or reviewed preview deployment.
- Do not treat preview deployment success as production approval.
- Require validation and smoke testing before promoting any deployment.
- Keep production deployment held until a later explicit approval.

## Build / Install Commands

Install command:

```sh
pnpm install --frozen-lockfile
```

Build command:

```sh
pnpm run build
```

Recommended validation before deployment:

```sh
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:coverage
pnpm run prisma:validate
pnpm run build
./scripts/pre-pr-review.sh
```

## Output / Runtime Notes

- The app is a Next.js App Router application.
- Vercel should use the Next.js framework preset.
- Route handlers under `app/api` remain disabled/fail-closed for Entra routes until a live-auth phase approves them.
- No custom output directory is currently documented.
- Runtime settings must be reviewed before staging deploy.

## Preview / Staging Environment Variables

Use placeholders first. Store real values only in Vercel environment variables, never in Git.

- `DATABASE_URL`
- `AUTH_PROVIDER`
- `AUTH_ENTRA_TENANT_ID`
- `AUTH_ENTRA_CLIENT_ID`
- `AUTH_ENTRA_CLIENT_SECRET`
- `AUTH_ENTRA_REDIRECT_URI`
- `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS`
- `AUTH_ENTRA_ROLE_CLAIM`
- `AUTH_PRODUCTION_READY=false`
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED=false`
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED=false`
- `BURGESS_AUDITED_PERSISTENCE_ENABLED=false`
- `BURGESS_LOCAL_DEV_WRITES_ENABLED=false`
- `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED=false`
- `BURGESS_PRODUCTION_WRITES_ENABLED=false`
- `BURGESS_PRODUCTION_AUTH_PROVIDER`
- `BURGESS_PRODUCTION_AUTH_ENABLED=false`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED=false`

## Production Environment Variables Later

- Use the production Neon database URL only in the Vercel production environment.
- Use the production Entra app registration only in the Vercel production environment.
- Keep `AUTH_PRODUCTION_READY=false` until the production auth readiness review passes.
- Keep `BURGESS_PRODUCTION_WRITES_ENABLED=false` until a later live-write phase approves production writes.

## Function Region Recommendation

- Choose a Vercel function region close to the selected Neon region where practical.
- Document the exact region before staging deploy.
- Revisit the decision before production if latency, reliability or client expectations require it.

## Logging / Monitoring Checklist

- Confirm Vercel deployment logs are visible to approved maintainers.
- Confirm runtime error logs are available.
- Confirm build failure alerts are routed to the responsible maintainer.
- Confirm no secrets are printed in logs.
- Confirm health route smoke check.

## Rollback Process

- Keep the previous successful deployment reference.
- Use Vercel rollback for app regressions.
- Disable auth/write flags if unexpected staging behavior appears.
- Do not attempt data rollback without a reviewed Neon restore path.

## Production Hold

- No production deploy until explicitly approved.
- No production domain cutover until DNS/domain approach is approved.
- No live auth until Entra staging validation is approved.
- No production writes until production auth, audit, migration and release-gate checks are approved.
