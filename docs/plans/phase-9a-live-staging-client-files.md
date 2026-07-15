# Phase 9A: Railway Staging Client File Creation

## Scope

Phase 9A makes Client Files usable for staging testing without opening broader production writes.

Allowed in this phase:

- Search and list saved client files from Railway staging Postgres.
- Open `/admin/clients/new` from the protected admin workspace.
- Create one minimal staging test client file.
- Save Client, optional primary Contact, AuditLog and TimelineEvent records through the existing Prisma schema.
- Return to `/admin/clients?created=1` and find the created test client.

Not allowed in this phase:

- `db:push`.
- Schema changes or destructive resets.
- Production database commands or production migrations.
- Production write enablement.
- Live Microsoft Entra auth.
- Document upload/download/storage.
- Matter creation.
- Invoice approval, statement sending or invoice numbering.
- LLM calls.
- Lexpro sync, WhatsApp, Yoco, Payfast, shop, checkout or payment flows.
- Real Burgess client data.

## Staging Write Gate

Client-file creation requires all of these:

- Protected admin password session.
- `BURGESS_STAGING_CLIENT_FILE_WRITES_ENABLED=true`.
- `DATABASE_URL` available in the staging runtime.

This gate is separate from `BURGESS_PRODUCTION_WRITES_ENABLED` and does not make production auth ready.

## User Flow

1. Sign in through the staging admin password route.
2. Open `/admin/clients`.
3. Search existing staging client files.
4. Click `Open New Client File`.
5. Enter minimal test data only.
6. Save.
7. Return to the list and search for the new client file.

## Data Captured

- Client display name.
- Account/reference number.
- Status.
- Primary contact name.
- Email.
- Phone.
- Opening note as audit/timeline metadata.

## Validation

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm test`
- `pnpm run test:coverage`
- `pnpm run prisma:validate`
- `pnpm run build`
- `./scripts/check-agent-context.sh`
- `./scripts/check-adr-needed.sh`
- `./scripts/pre-pr-review.sh`

## Staging Smoke

Use one clearly marked test record only, for example:

`TEST Client File - Delete Later`

Confirm:

- `/admin/clients` loads.
- Search box is visible.
- `/admin/clients/new` loads after sign-in.
- The test client saves.
- The test client appears in the list/search.

Do not enter real client information.
