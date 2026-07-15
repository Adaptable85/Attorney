# Phase 10A: GhostPractice-Inspired Admin Workflow and Visual Redesign

Status: Implemented locally.

## Summary

Phase 10A reshapes the protected Burgess Attorneys admin staging workspace to feel more like a legal practice management system: compact practice-file tables, matter-centric workspaces, operational filters, dense financial/document columns and a restrained purple/indigo accent system.

This is an inspired workflow redesign only. It does not copy GhostPractice branding, logos, exact layouts, icons or proprietary trade dress.

## Scope

- `/admin/clients` is presented as the primary `Files` workspace.
- File rows use dense operational columns for file reference, client, primary matter context, status, draft financial placeholders, responsible person, updated date and row actions.
- Client file detail uses a compact summary bar and keeps `Overview`, `Matters`, `General Documents`, `Statement` and `Audit`.
- Billing library content remains removed from the client file.
- Matter detail is the primary operational workspace for matter documents, matter notes / voice-note summaries, billing, draft invoices, statement pull-through and audit context.
- `/admin/matters` uses a compact matter index with filter/search controls and matter row actions.

## Safety Boundaries

- No schema change.
- No migration.
- No `db:push`.
- No production database command.
- No production write gate.
- No live Microsoft Entra auth.
- No invoice approval, official invoice number assignment, PDF generation or sending.
- No statement sending.
- No payment, Yoco, Payfast, shop or checkout behavior.
- No WhatsApp, Lexpro sync or LLM action.

## Validation

Run the normal deterministic suite before PR/deploy decisions:

```sh
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
