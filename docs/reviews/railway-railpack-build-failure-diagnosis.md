# Railway Railpack Build Failure Diagnosis

Date/time: 2026-06-25 10:01:02 SAST

## Scope

Phase 5N diagnosed the first controlled Railway staging deploy failure for the Burgess Attorneys Attorney app. This phase did not retry deployment, run migrations, run `db:push`, add secrets, add a production domain, enable live Microsoft Entra auth, enable UI saves or enable production writes.

## Target

- Railway project: `burgess-attorneys-staging`
- Railway project ID: `46a94859-6ba1-47b8-8e64-4b66a90dc3fa`
- Railway app service: `attorney-web`
- Railway app service ID: `de7fc164-c220-4d5a-8c91-754423f8e994`
- Railway deployment diagnosed: `39710650-fe18-4bf9-a6ea-a068a6c0d57e`
- Railway environment name: `production`
  - This is Railway's default environment name inside the staging project. It is not an approved Attorney production deployment.

## Evidence

Local project inspection found:

- Package manager: `pnpm`
- `packageManager`: `pnpm@10.18.1`
- `build` script: present as `next build`
- `start` script before fix: absent
- Railway config before fix: absent
- Conflicting `railway.toml`, `nixpacks.toml`, `Procfile` or Dockerfile: not present

Railway build logs for deployment `39710650-fe18-4bf9-a6ea-a068a6c0d57e` showed:

- Railpack detected Node.
- Railpack detected the pnpm package manager.
- Railpack installed pnpm through Corepack.
- Railpack failed with `No start command detected`.

The failure was therefore classified as a missing runtime start command, not a dependency install failure, Next.js build failure, Prisma migration failure, database issue, route/runtime exception or production variable issue.

## Fix

Minimal staging-compatible configuration was added:

- `package.json`: added `start` script:

  ```json
  "start": "next start -p ${PORT:-3000}"
  ```

- `railway.json`: added minimal Railpack config:

  ```json
  {
    "$schema": "https://railway.com/railway.schema.json",
    "build": {
      "builder": "RAILPACK"
    },
    "deploy": {
      "startCommand": "pnpm start"
    }
  }
  ```

This does not deploy the app. It only gives Railpack an explicit runtime command for the next reviewed staging deploy attempt.

## Safety Confirmations

- No Railway deploy retry was run.
- `railway up` was not run.
- `railway deploy` was not run.
- No Prisma migration was run.
- `db:push` was not run.
- No production database command was run.
- No production migration was run.
- No production/custom domain was added.
- No secrets, `DATABASE_URL` values, database passwords, Railway tokens or Microsoft client secrets were printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
- No invoice, statement, WhatsApp, email or Lexpro workflow was started.
- No unrelated external repo or file was touched.

## Next Recommendation

Open a review PR for this config fix. Retry the Railway staging deploy only after this fix is reviewed and merged, with safe/off environment gates reconfirmed and without running migrations unless a separate staging migration phase explicitly approves it.

## Phase 5O Follow-Up

Date/time: 2026-06-25 10:17:43 SAST

The Phase 5N config fix was merged in PR #13 and Phase 5O retried the controlled Railway staging deploy to `attorney-web`.

Result:

- Deploy command: `railway up --service attorney-web --message "Phase 5O controlled Attorney staging deploy retry after start config"`.
- Deployment ID: `7c05f3a4-38b4-489c-a1a7-f97b3e02426f`.
- Build status: successful; Railpack detected the custom `pnpm start` command and ran `pnpm run build`.
- Runtime status: online; Next.js started and reported ready.
- Generated Railway staging URL: not confirmed by CLI output.
- Migration status: not run and still pending.
- Production/custom domain: not added.

Safety status remains unchanged:

- No Prisma migration was run.
- `db:push` was not run.
- No production database command or production migration was run.
- No secrets, raw database URL, database password, Railway token or Microsoft client secret was printed or committed.
- Live Microsoft Entra auth remains disabled.
- UI saves remain disabled.
- Production writes remain blocked.
