# Production Auth Provider Decision Pack

Status: Approved direction: Microsoft Entra ID / Microsoft 365 identity
Date: 2026-06-23

## A. Project Auth Requirements

Burgess Attorneys is a legal-admin platform that will handle sensitive client, matter, document, communication and financial information. Production authentication must be treated as a legal-risk control, not a convenience feature.

Requirements:

- Production auth must fail closed when config, provider claims or role mappings are missing.
- Owner/principal attorney accounts need full control, including future approval powers.
- Support admin accounts may prepare and manage operational work but must not receive owner approval powers by default.
- Agent service users are draft-only and must never receive normal admin write or owner powers.
- Read-only reviewer users remain limited and cannot mutate records.
- MFA is required or strongly recommended for all human production users.
- Session expiry and revocation behavior must be defined before live writes.
- Provider role claims must map only to explicit Burgess role keys.
- Login, failed login and permission-change events are audit-relevant.
- No live writes may be enabled until production auth readiness, audit boundary, transaction boundary and release gates are approved.

## B. Provider Comparison

| Provider route | Security fit | MFA support | Role/claim mapping | Admin/user management | Cost/complexity | Next.js compatibility | Vendor lock-in | Operational burden | Small-law-firm fit | Microsoft 365/Graph fit | Staging/prod separation | Auditability |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Auth.js / NextAuth-style self-managed auth | Flexible but depends heavily on correct local configuration and secure secret/session handling. | Depends on chosen upstream provider or custom implementation. | Flexible via callbacks/JWT/session mapping. | Mostly self-managed unless paired with an identity provider. | Lower direct vendor cost, higher engineering/security cost. | Strong Next.js fit. | Low platform lock-in, but auth design becomes app-owned. | Highest burden for secure operations. | Poor default for legal production unless strong auth expertise exists. | Good if used only as OIDC bridge to Microsoft Entra. | Must be designed and tested. | App must implement audit capture around auth events. |
| Clerk | Strong managed auth defaults and fast setup. | Supports MFA strategies through Clerk dashboard and SDK flows. | Can map claims/metadata, but role model must be explicitly reviewed. | Strong managed user/admin UI. | Faster setup, recurring vendor dependency. | Strong Next.js SDK support. | Medium/high. | Low to medium. | Good if speed and managed UX matter more than Microsoft identity ownership. | Not the natural Microsoft 365 control plane, though federation may be possible. | Good project/environment separation if configured carefully. | Provider events/webhooks need review. |
| Supabase Auth | Solid managed auth tied to Supabase platform. | Supports authenticator app and phone MFA. | Claims/custom access tokens need careful design. | Useful dashboard, but best fit when Supabase is also the backend platform. | Moderate; may pull auth toward Supabase stack. | Next.js SSR support exists. | Medium/high if auth and data platform converge. | Medium. | Acceptable if Supabase is selected for broader platform hosting; less ideal solely for auth. | Weak Microsoft 365 fit compared with Entra. | Good project separation if projects are isolated. | Needs explicit event/audit integration. |
| Microsoft Entra ID / Azure AD / Microsoft 365 identity | Strong enterprise identity fit, especially if Burgess already uses Microsoft 365. | Strong MFA and conditional-access ecosystem. | OIDC claims can be mapped to explicit Burgess roles after review. | Firm-controlled user lifecycle through Microsoft tenant. | Complexity depends on tenant/admin maturity; may use existing subscription. | Works through OIDC/Auth.js or a Microsoft-oriented adapter. | Medium, but aligns with Microsoft workplace identity. | Medium, often lower if the firm already uses Microsoft 365. | Best fit if Burgess already manages staff accounts in Microsoft 365. | Best option for future Microsoft Graph/shared mailbox integration. | Strong staging/prod separation requires app registrations and tenant process. | Sign-in and policy events can be reviewed through Microsoft tooling plus app audit logs. |
| Auth0 or similar enterprise identity provider | Strong managed identity and mature security controls. | Strong MFA and adaptive/security policy options. | Custom claims/roles are mature but must be namespaced and tested. | Strong admin console and tenant separation. | Higher cost/complexity than Clerk for small teams. | Next.js SDK and OIDC support available. | Medium/high. | Medium. | Good where enterprise auth maturity is needed without Microsoft tenant dependence. | Good federation possible but not as direct as Entra. | Strong tenant/environment separation. | Good provider logs plus app audit integration. |

## C. Approved Direction

Approved direction: Microsoft Entra ID / Microsoft 365 identity.

Use Microsoft Entra ID / Microsoft 365 identity as the production authentication provider direction for firm-controlled login, MFA and future Microsoft Graph/shared-mailbox integration.

Still pending before implementation:

- Confirm Burgess Microsoft 365 tenant/admin access.
- Confirm MFA availability and enforcement policy.
- Confirm allowed users/domains.
- Confirm role claim approach.
- Confirm break-glass admin process.
- Configure environment variables with secrets stored outside Git.
- Complete staging validation.
- Complete production readiness review.

## D. Implementation Plan

- Phase Auth-1: Provider decision approval. Complete via ADR 0007.
- Phase Auth-2: Environment/config setup with placeholders reviewed and secrets stored outside Git.
- Phase Auth-3: Provider adapter implementation behind the existing `ProductionAuthAdapter` boundary.
- Phase Auth-4: Role claim mapping to `OWNER_PRINCIPAL`, `SUPPORT_ADMIN`, `AGENT_SERVICE` and `READ_ONLY_REVIEWER`.
- Phase Auth-5: MFA/session enforcement, including expiry, revocation and secure-cookie behavior.
- Phase Auth-6: Staging validation with fake/test users only.
- Phase Auth-7: Production readiness review, including backup, rollback, lockout and audit checks.
- Phase Auth-8: Enable production auth readiness flag only after approval.
- Phase Auth-9: Only then consider live persistence gates.

## E. Environment Variable Checklist

Placeholder names only. Do not commit real values.

- `BURGESS_PRODUCTION_AUTH_PROVIDER=<microsoft_entra_id|auth0|clerk|authjs>`
- `BURGESS_PRODUCTION_AUTH_ISSUER_URL=<provider issuer URL>`
- `BURGESS_PRODUCTION_AUTH_CLIENT_ID=<provider client ID>`
- `BURGESS_PRODUCTION_AUTH_CLIENT_SECRET=<stored in secret manager>`
- `BURGESS_PRODUCTION_AUTH_REDIRECT_URI=<approved callback URL>`
- `BURGESS_PRODUCTION_AUTH_ALLOWED_EMAIL_DOMAIN=<burgess-approved domain>`
- `BURGESS_PRODUCTION_AUTH_ALLOWED_EMAILS=<optional explicit allowlist>`
- `BURGESS_PRODUCTION_AUTH_ROLE_CLAIM=<claim containing Burgess role key>`
- `BURGESS_SESSION_SECRET=<stored in secret manager>`
- `BURGESS_PRODUCTION_AUTH_ENABLED=false`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED=false`
- `BURGESS_PRODUCTION_WRITES_ENABLED=false`

## F. Security Checklist

- Enforce MFA for all human users.
- Define strong session expiry and revocation behavior.
- Use secure, HTTP-only cookies.
- Require HTTPS only in staging/production.
- Add CSRF protection where browser-submitted mutations are introduced.
- Maintain callback URL allowlist.
- Maintain email/domain allowlist.
- Map roles with least privilege.
- Never map an agent account to owner role.
- Audit login, failed login and permission changes.
- Define account recovery process.
- Define owner lockout recovery process.
- Define break-glass admin process with audit requirements.
- Define secret rotation and incident response steps.

## G. Testing Checklist

- Missing provider config fails closed.
- Invalid provider config fails closed.
- Unknown role fails closed.
- Agent role is blocked from admin writes.
- Support admin cannot approve invoices/statements.
- Owner can access owner controls.
- Read-only reviewer cannot mutate.
- Unauthenticated user is blocked.
- Expired session is blocked.
- Production writes stay blocked until production auth readiness is true and production write gates are approved.

## H. Rollback Plan

- Disable `BURGESS_PRODUCTION_AUTH_ENABLED`.
- Disable `BURGESS_PRODUCTION_AUTH_CONFIGURED`.
- Disable `BURGESS_PRODUCTION_WRITES_ENABLED`.
- Disable client/matter write gates.
- Revert provider environment variables in the deployment platform.
- Keep read-only mode available if possible.
- Preserve auth and app audit logs.
- Never downgrade production to local/dev placeholder auth or an insecure fallback.

## References

- Microsoft identity platform OpenID Connect documentation: https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc
- Microsoft Entra MFA overview: https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-mfa-multi-factor-authentication
- Clerk Next.js quickstart and MFA documentation: https://clerk.com/docs/nextjs/getting-started/quickstart and https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
- Supabase Auth Next.js and MFA documentation: https://supabase.com/docs/guides/auth/quickstarts/nextjs and https://supabase.com/docs/guides/auth/auth-mfa
- Auth.js Next.js reference: https://authjs.dev/reference/nextjs
- Next.js authentication guide: https://nextjs.org/docs/app/guides/authentication
