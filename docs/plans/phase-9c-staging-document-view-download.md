# Phase 9C - Staging Document View and Download

Date: 2026-07-15

## Goal

Allow staging admin testers to open and download documents that were uploaded into a saved client file during Phase 9B.

This is limited to Railway staging test data and the existing admin password session.

## Scope

- Add protected document view and download routes under the client file workspace.
- Show `View` and `Download` actions in the uploaded document list.
- Read stored test document bytes from the private staging database.
- Audit document view and download events.
- Keep document access private and fail closed.

## Non-Scope

- No public document URLs.
- No public file storage.
- No production document storage.
- No document replacement, archive, delete or sharing workflow.
- No production writes.
- No live Microsoft Entra auth.
- No invoice approval, statement sending, Lexpro sync, WhatsApp, payment, Yoco, Payfast, shop or checkout behavior.
- No `db:push`.

## Acceptance Criteria

- `/admin/clients/[clientId]/documents/[documentId]/view` returns an inline response only for an authenticated staging admin session.
- `/admin/clients/[clientId]/documents/[documentId]/download` returns an attachment response only for an authenticated staging admin session.
- Wrong-client or missing documents return not found.
- Missing database configuration and disabled access fail closed.
- The client file document list exposes clear `View` and `Download` actions.
- Staging smoke verifies a disposable uploaded test document can be viewed and downloaded.
