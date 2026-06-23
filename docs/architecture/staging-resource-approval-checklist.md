# Staging Resource Approval Checklist

Status: Phase 5D approval checklist
Date: 2026-06-23

This checklist must be completed before actual Vercel or Supabase staging resources are created. Completion of this document does not approve production deployment.

## Required Approvals

| Item | Required decision | Approved by | Status / notes |
| --- | --- | --- | --- |
| Vercel team/account | Confirm account/team that will own the project. | `<name>` | Pending |
| Supabase account/project | Confirm account/project owner. | `<name>` | Pending |
| Region | Confirm Vercel function region and Supabase region. | `<name>` | Pending |
| Staging URL | Confirm staging URL and callback base URL. | `<name>` | Pending |
| Environment variable owner | Confirm who enters and reviews Vercel env vars. | `<name>` | Pending |
| Migration runner | Confirm who runs staging migrations. | `<name>` | Pending |
| Deploy approver | Confirm who approves staging deploy. | `<name>` | Pending |
| DB backup owner | Confirm who verifies Supabase backup/restore settings. | `<name>` | Pending |
| Entra tenant/admin owner | Confirm who owns Entra staging app registration. | `<name>` | Pending |
| Domain/DNS owner | Confirm who controls DNS if staging domain is needed. | `<name>` | Pending |

## Safety Confirmations

- [ ] No real client data will be used in staging.
- [ ] No production writes will be enabled.
- [ ] No production domain will be attached.
- [ ] No production database will be created by the staging step.
- [ ] No production database URL will be used.
- [ ] No `db:push` will be run.
- [ ] No destructive database reset will be run.
- [ ] No real secrets will be committed to Git.
- [ ] `AUTH_PRODUCTION_READY=false`.
- [ ] `BURGESS_PRODUCTION_AUTH_ENABLED=false`.
- [ ] `BURGESS_PRODUCTION_AUTH_CONFIGURED=false`.
- [ ] `BURGESS_PRODUCTION_WRITES_ENABLED=false`.
- [ ] UI saves remain disabled.
- [ ] Entra live login remains disabled unless a later live-auth phase explicitly approves it.

## Approval Outcome

- Decision: Pending.
- Approved staging resource creation date: `<date>`.
- Conditions: `<conditions>`.
- Residual risks accepted by: `<name>`.
