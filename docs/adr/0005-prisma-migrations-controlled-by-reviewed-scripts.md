# 0005: Prisma Migrations Controlled By Reviewed Scripts

Status: Accepted
Date: 2026-06-18

## Context

The platform will store sensitive legal, client and financial data. Prisma schema exists, but no migrations have been created or applied yet. Unreviewed production migrations could damage confidential records or approved financial history.

## Decision

Use Prisma schema as the schema definition source.

Migrations must be controlled and reviewed. Agents may validate schema and generate dev migrations only when explicitly instructed. Agents may not apply production migrations automatically.

## Consequences

- Database changes stay explicit and reviewable.
- Production data changes require human approval, backup checks and rollback planning.
- Future phases need a local database workflow before repository implementations are wired to Prisma.

