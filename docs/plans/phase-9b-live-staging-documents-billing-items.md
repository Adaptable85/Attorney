# Phase 9B - Live Staging Document Uploads and Billing Item Templates

## Summary

Phase 9B extends the Railway staging client-file workflow with two explicit staging-only write paths:

- Test document uploads inside a saved client file.
- Reusable billing item template create/edit from `/admin/invoice-items`.

Both paths require the staging admin password session, Railway staging Postgres, and explicit gates:

- `BURGESS_STAGING_DOCUMENT_UPLOADS_ENABLED=true`
- `BURGESS_STAGING_BILLING_ITEMS_ENABLED=true`

Production writes, live Microsoft Entra auth, invoice approval/sending, statement sending, LLM calls, Lexpro sync, WhatsApp, payment providers and `db:push` remain blocked.

## Implementation Notes

- Uploaded test documents store metadata in `DocumentRecord` and file bytes in `DocumentContent`.
- Document uploads are capped at 10 MB and keep documents private by default.
- Reusable billing templates use integer cents and configurable VAT treatment.
- Billing templates are not invoice lines and cannot approve, number or send invoices/statements.
- Client-file section tabs are real in-page links.
- The client file shows uploaded documents and a billing item sidebar with a manage link.

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
```

Railway staging deployment must use only:

```sh
pnpm exec prisma migrate deploy
```

Do not run `pnpm run db:push`.
