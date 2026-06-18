# 0003: Invoice Number Assigned On Approval

Status: Accepted
Date: 2026-06-18

## Context

Draft invoice work can be created manually or from agent-assisted capture. Drafts may be edited or rejected. Official invoice numbers should not be consumed before owner/principal approval.

## Decision

Draft invoices use internal draft IDs only.

Official invoice numbers are assigned only when the owner/principal attorney approves the invoice.

## Consequences

- Draft work can change without creating official invoice-number gaps.
- Approval becomes the point where financial numbering rules apply.
- Number assignment must be transactional and audit logged in the future implementation.

