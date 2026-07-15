# Phase 9G: Separate Client General Documents From Matter Documents

Date: 2026-07-15

## Status

Implemented.

## Scope

Phase 9G clarifies the staging admin document workflow so client file documents
and matter-specific documents are visibly separate:

- Client file documents are labelled as **Client General Documents**.
- Client file upload copy is for ID, proof of address, FICA, company
  registration, authority / mandate and general correspondence.
- The visible client upload field now says **Client document category**.
- Client general document filename guidance now uses
  `ClientName_ClientDocumentType_Date`.
- Matter pages keep **Matter Documents**, `Matter/reference label`, matter
  reference defaults and matter-specific view/download behavior.

## Non-Scope

This phase does not change schema, routes, storage, authentication, gates,
migrations or production-write behavior. Existing `matterReference` metadata is
still used to store the client document category for client-general documents
until a later schema-cleanup phase is approved.

## Safety

- No `db:push`.
- No schema migration.
- No production database command.
- No production writes.
- No live Microsoft Entra auth.
- No invoice approval, statement sending, Lexpro sync, WhatsApp, Yoco, Payfast,
  shop, checkout or LLM behavior.

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

## Smoke Plan

After deployment to Railway staging:

1. Sign in to admin.
2. Open a saved staging client file.
3. Confirm the client document area is clearly for ID, proof of address, FICA
   and other general client documents.
4. Upload one disposable general client test document.
5. Open a saved staging matter.
6. Confirm the matter document area remains matter-specific.
7. Upload one disposable matter test document.
8. View and download both files.
