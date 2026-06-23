# 0007: Use Microsoft Entra For Production Auth

Status: Accepted
Date: 2026-06-23

## Context

Burgess Attorneys is a legal-admin platform handling sensitive client, matter and financial information. Production auth must support firm-controlled identity, role mapping, MFA, auditability and future Microsoft 365/Graph compatibility.

## Decision

Use Microsoft Entra ID / Microsoft 365 identity as the production authentication provider direction, subject to confirming Burgess Attorneys tenant/admin access, MFA policy and allowed users/domains.

## Consequences

- Implementation must use the provider-neutral adapter boundaries already created.
- Auth must fail closed when Entra config is missing or invalid.
- Secrets must never be committed.
- Production auth readiness remains disabled until Entra config and staging validation are complete.
- Production writes remain disabled until Entra auth, role mapping, audit, transaction and release-gate checks pass.
