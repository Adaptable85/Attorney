# Project Overview

Project: Burgess Attorneys Admin Automation Platform

Phase -1 status: repository operating system only.

## Purpose

Create a controlled legal-admin and billing platform for Burgess Attorneys Inc.

The first usable product is the internal legal-admin and billing platform. It is not website-first and not agent-first.

## Current Scope Boundary

Phase -1 creates only:

- Agent context files.
- Planning structure.
- Deterministic validation scripts.
- Git hooks.
- Quality workflow.
- Pre-PR review safeguards.

Phase -1 does not create:

- Dashboard.
- Invoice workflow.
- Statement workflow.
- WhatsApp automation.
- Lexpro import/sync.
- Website.
- Marketing system.
- Outreach system.
- API.
- Database.
- Auth implementation.

## Source Documents

- `PROJECT_SHEET.md`
- `GOAL_SHEET.md`
- `SOURCE_PITCH.md`

Additional referenced source material:

- Client Scope Review & Coding Job Setup Pack.
- Interrogate Me skill decisions already captured.

## Captured Decisions

1. First usable product is the internal legal-admin and billing platform.
2. Day-one access model:
   - Owner / Principal Attorney = full control.
   - Wesley / Build Support = restricted technical/support admin.
   - OpenClaw Agent = draft-only service user.
3. Financial boundary:
   - Burgess platform is source of truth for invoices and client-facing statement PDFs.
   - Lexpro remains source of truth for legal/trust accounting, bookkeeping, reconciled payments and compliance records.
4. Invoice numbers are assigned only when the owner/principal approves the invoice.
5. Unresolved financial details remain configurable and must not be hardcoded.

