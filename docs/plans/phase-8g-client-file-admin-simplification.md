# Phase 8G Client File Admin Simplification

## Summary

Phase 8G simplifies the admin review workspace around a client-file-first workflow.
The primary admin path is now Client Files, with a separate Invoice Items review
library for reusable billing building blocks.

## Implemented

- `/admin` now presents the admin review workspace as a client-file-first workflow.
- `/admin/clients` now presents client files as the main workspace.
- `/admin/clients/[slug]` now previews matters, documents, notes/voice notes, billing items, draft invoices, draft statements and audit history inside the client file.
- `/admin/invoice-items` now previews reusable invoice item templates using integer-cent placeholder amounts and configurable VAT labels.
- Top-level navigation now emphasizes Client Files, Invoice Items, Lexpro Boundary, Audit and Access.

## Boundaries

- No deploy.
- No migration.
- No `db:push`.
- No real client data.
- No document upload/download/storage.
- No LLM call or transcription service.
- No live Microsoft Entra auth.
- No UI saves or production writes.
- No invoice approval, invoice numbering, statement sending or Lexpro sync.
- No payment gateway, Yoco, Payfast, shop, checkout or membership functionality.

## Next

Review this simplified client-file flow with Stephanie before approving schema,
auth, storage, LLM drafting or write-path work.
