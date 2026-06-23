# Environment Variable Template

Status: Phase 5G template update
Date: 2026-06-23

This template lists required and known environment variables with placeholders only. Do not commit real values. Store secrets only in local `.env.local` or approved provider secret stores.

## Local

| Variable | Placeholder | Secret | Initial value / note |
| --- | --- | --- | --- |
| `DATABASE_URL` | `postgresql://<local-user>@localhost:5432/burgess_attorneys_dev` | Yes | Local only. Must not point to remote databases for DB tests. |
| `AUTH_PROVIDER` | `entra` | No | Placeholder only. Does not enable live login. |
| `AUTH_ENTRA_TENANT_ID` | `<local-placeholder-tenant-id>` | No | Placeholder only. |
| `AUTH_ENTRA_CLIENT_ID` | `<local-placeholder-client-id>` | No | Placeholder only. |
| `AUTH_ENTRA_CLIENT_SECRET` | `<local-placeholder-secret>` | Yes | Placeholder only. Never commit a real secret. |
| `AUTH_ENTRA_REDIRECT_URI` | `http://localhost:3000/api/auth/entra/callback` | No | Route remains disabled until live-auth approval. |
| `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS` | `example.test` | No | Placeholder only. |
| `AUTH_ENTRA_ROLE_CLAIM` | `roles` | No | Placeholder only. |
| `AUTH_ENTRA_ISSUER_URL` | `<optional-local-placeholder-issuer-url>` | No | Optional override. |
| `AUTH_PRODUCTION_READY` | `false` | No | Must remain false. |
| `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED` | `false` | No | Must remain false unless a later staging-auth phase approves it. |
| `BURGESS_CLIENT_MATTER_WRITES_ENABLED` | `false` | No | May be true only in explicit dev-only fake-data write tests. |
| `BURGESS_AUDITED_PERSISTENCE_ENABLED` | `false` | No | May be true only in explicit dev-only fake-data write tests. |
| `BURGESS_LOCAL_DEV_WRITES_ENABLED` | `false` | No | Local/dev only. Must be false outside approved fake-data tests. |
| `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED` | `false` | No | Local/dev only. Must be false outside approved fake-data tests. |
| `BURGESS_PRODUCTION_WRITES_ENABLED` | `false` | No | Must remain false. |
| `BURGESS_PRODUCTION_AUTH_PROVIDER` | `microsoft_entra_id` | No | Direction only; does not enable production auth. |
| `BURGESS_PRODUCTION_AUTH_ENABLED` | `false` | No | Must remain false. |
| `BURGESS_PRODUCTION_AUTH_CONFIGURED` | `false` | No | Must remain false. |
| `BURGESS_PRODUCTION_AUTH_TENANT_ID` | `<placeholder-tenant-id>` | No | Placeholder only. |
| `BURGESS_PRODUCTION_AUTH_CLIENT_ID` | `<placeholder-client-id>` | No | Placeholder only. |
| `BURGESS_PRODUCTION_AUTH_CLIENT_SECRET` | `<placeholder-secret>` | Yes | Placeholder only. Never commit a real secret. |
| `BURGESS_PRODUCTION_AUTH_REDIRECT_URI` | `<placeholder-callback-url>` | No | Placeholder only. |
| `BURGESS_PRODUCTION_AUTH_ALLOWED_EMAIL_DOMAIN` | `<placeholder-domain>` | No | Placeholder only. |
| `BURGESS_PRODUCTION_AUTH_ROLE_CLAIM` | `roles` | No | Placeholder only. |
| `BURGESS_PRODUCTION_AUTH_ISSUER_URL` | `<optional-placeholder-issuer-url>` | No | Optional override. |
| `BURGESS_DEV_CURRENT_ROLE` | `OWNER_PRINCIPAL` | No | Local/dev placeholder principal only. |
| `BURGESS_ALLOW_DEV_SEED` | `false` | No | Must be explicit for dev seed commands. |
| `BURGESS_ALLOW_DEV_DB_RESET` | `false` | No | Must be explicit for dev reset commands. |

## Staging

| Variable | Placeholder | Secret | Initial value / note |
| --- | --- | --- | --- |
| `DATABASE_URL` | `<supabase-staging-postgres-url>` | Yes | Staging Supabase Postgres URL only. No production DB URL. |
| `AUTH_PROVIDER` | `entra` | No | Placeholder until staging auth approval. |
| `AUTH_ENTRA_TENANT_ID` | `<staging-tenant-id>` | No | Add only in Vercel staging secrets/settings. |
| `AUTH_ENTRA_CLIENT_ID` | `<staging-client-id>` | No | Add only in Vercel staging settings. |
| `AUTH_ENTRA_CLIENT_SECRET` | `<staging-client-secret>` | Yes | Secret store only. |
| `AUTH_ENTRA_REDIRECT_URI` | `https://<staging-app-url>/api/auth/entra/callback` | No | Exact URL required before live auth testing. |
| `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS` | `<approved-staging-domain>` | No | Must match approved test users. |
| `AUTH_ENTRA_ROLE_CLAIM` | `roles` | No | Confirm with Entra app registration. |
| `AUTH_ENTRA_ISSUER_URL` | `<optional-staging-issuer-url>` | No | Optional override. |
| `AUTH_PRODUCTION_READY` | `false` | No | Must remain false initially. |
| `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED` | `false` | No | Must remain false initially. |
| `BURGESS_CLIENT_MATTER_WRITES_ENABLED` | `false` | No | Must remain false initially. |
| `BURGESS_AUDITED_PERSISTENCE_ENABLED` | `false` | No | Must remain false initially unless fake-data staging writes are later approved. |
| `BURGESS_LOCAL_DEV_WRITES_ENABLED` | `false` | No | Must remain false in staging. |
| `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED` | `false` | No | Must remain false in staging. |
| `BURGESS_PRODUCTION_WRITES_ENABLED` | `false` | No | Must remain false. |
| `BURGESS_PRODUCTION_AUTH_PROVIDER` | `microsoft_entra_id` | No | Direction only. |
| `BURGESS_PRODUCTION_AUTH_ENABLED` | `false` | No | Must remain false initially. |
| `BURGESS_PRODUCTION_AUTH_CONFIGURED` | `false` | No | Must remain false initially. |
| `BURGESS_PRODUCTION_AUTH_TENANT_ID` | `<staging-tenant-id>` | No | Placeholder only unless staging-auth phase approves mirrored naming. |
| `BURGESS_PRODUCTION_AUTH_CLIENT_ID` | `<staging-client-id>` | No | Placeholder only unless staging-auth phase approves mirrored naming. |
| `BURGESS_PRODUCTION_AUTH_CLIENT_SECRET` | `<staging-client-secret>` | Yes | Secret store only. |
| `BURGESS_PRODUCTION_AUTH_REDIRECT_URI` | `https://<staging-app-url>/api/auth/entra/callback` | No | Placeholder until staging-auth approval. |
| `BURGESS_PRODUCTION_AUTH_ALLOWED_EMAIL_DOMAIN` | `<approved-staging-domain>` | No | Placeholder until staging-auth approval. |
| `BURGESS_PRODUCTION_AUTH_ROLE_CLAIM` | `roles` | No | Placeholder until staging-auth approval. |
| `BURGESS_PRODUCTION_AUTH_ISSUER_URL` | `<optional-staging-issuer-url>` | No | Optional override. |
| `BURGESS_DEV_CURRENT_ROLE` | `<unset>` | No | Do not use local placeholder auth in staging unless explicitly approved. |
| `BURGESS_ALLOW_DEV_SEED` | `false` | No | Must remain false unless fake staging seed is separately approved. |
| `BURGESS_ALLOW_DEV_DB_RESET` | `false` | No | Must remain false. |

## Production

| Variable | Placeholder | Secret | Initial value / note |
| --- | --- | --- | --- |
| `DATABASE_URL` | `<supabase-production-postgres-url>` | Yes | Production Supabase Postgres URL only after approval. |
| `AUTH_PROVIDER` | `entra` | No | Does not by itself approve live auth. |
| `AUTH_ENTRA_TENANT_ID` | `<production-tenant-id>` | No | Add only after Entra production configuration approval. |
| `AUTH_ENTRA_CLIENT_ID` | `<production-client-id>` | No | Add only after approval. |
| `AUTH_ENTRA_CLIENT_SECRET` | `<production-client-secret>` | Yes | Secret store only. |
| `AUTH_ENTRA_REDIRECT_URI` | `https://<production-app-url>/api/auth/entra/callback` | No | Exact URL required. |
| `AUTH_ENTRA_ALLOWED_EMAIL_DOMAINS` | `<approved-production-domain>` | No | Must match approved Burgess tenant/domain. |
| `AUTH_ENTRA_ROLE_CLAIM` | `roles` | No | Confirm with Entra role mapping. |
| `AUTH_ENTRA_ISSUER_URL` | `<optional-production-issuer-url>` | No | Optional override. |
| `AUTH_PRODUCTION_READY` | `false` | No | Must remain false until production auth readiness is approved. |
| `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED` | `false` | No | Must remain false in production unless replaced by approved live-auth wiring. |
| `BURGESS_CLIENT_MATTER_WRITES_ENABLED` | `false` | No | Must remain false until live-write phase approval. |
| `BURGESS_AUDITED_PERSISTENCE_ENABLED` | `false` | No | Must remain false until audited persistence readiness is approved. |
| `BURGESS_LOCAL_DEV_WRITES_ENABLED` | `false` | No | Must remain false. |
| `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED` | `false` | No | Must remain false. |
| `BURGESS_PRODUCTION_WRITES_ENABLED` | `false` | No | Must remain false until production write approval. |
| `BURGESS_PRODUCTION_AUTH_PROVIDER` | `microsoft_entra_id` | No | Accepted provider direction. |
| `BURGESS_PRODUCTION_AUTH_ENABLED` | `false` | No | Must remain false until production auth approval. |
| `BURGESS_PRODUCTION_AUTH_CONFIGURED` | `false` | No | Must remain false until production auth configuration is complete. |
| `BURGESS_PRODUCTION_AUTH_TENANT_ID` | `<production-tenant-id>` | No | Placeholder only until approval. |
| `BURGESS_PRODUCTION_AUTH_CLIENT_ID` | `<production-client-id>` | No | Placeholder only until approval. |
| `BURGESS_PRODUCTION_AUTH_CLIENT_SECRET` | `<production-client-secret>` | Yes | Secret store only. |
| `BURGESS_PRODUCTION_AUTH_REDIRECT_URI` | `https://<production-app-url>/api/auth/entra/callback` | No | Exact URL required. |
| `BURGESS_PRODUCTION_AUTH_ALLOWED_EMAIL_DOMAIN` | `<approved-production-domain>` | No | Confirm before live auth. |
| `BURGESS_PRODUCTION_AUTH_ROLE_CLAIM` | `roles` | No | Confirm before live auth. |
| `BURGESS_PRODUCTION_AUTH_ISSUER_URL` | `<optional-production-issuer-url>` | No | Optional override. |
| `BURGESS_DEV_CURRENT_ROLE` | `<unset>` | No | Must be unset in production. |
| `BURGESS_ALLOW_DEV_SEED` | `false` | No | Must remain false. |
| `BURGESS_ALLOW_DEV_DB_RESET` | `false` | No | Must remain false. |

## Initial False / Off Requirements

The following must remain false/off for staging initially:

- `AUTH_PRODUCTION_READY`
- `BURGESS_ENTRA_STAGING_AUTH_WIRING_ENABLED`
- `BURGESS_CLIENT_MATTER_WRITES_ENABLED`
- `BURGESS_AUDITED_PERSISTENCE_ENABLED`
- `BURGESS_LOCAL_DEV_WRITES_ENABLED`
- `BURGESS_DEV_MUTATION_ENTRYPOINTS_ENABLED`
- `BURGESS_PRODUCTION_WRITES_ENABLED`
- `BURGESS_PRODUCTION_AUTH_ENABLED`
- `BURGESS_PRODUCTION_AUTH_CONFIGURED`
- `BURGESS_ALLOW_DEV_SEED`
- `BURGESS_ALLOW_DEV_DB_RESET`
