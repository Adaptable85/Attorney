# 0001: Modular Monolith With Next.js And TypeScript

Status: Accepted
Date: 2026-06-18

## Context

Burgess Attorneys needs an internal legal-admin and billing platform before website, marketing, WhatsApp or Lexpro automation. The platform will need server-side permissions, auditability, form workflows, document access controls and future integrations.

## Decision

Use a TypeScript Next.js App Router application as a modular monolith.

Keep business logic in server-side domain/service modules. Do not start with microservices.

## Consequences

- One repo can hold app, services, tests and documentation.
- Next.js supports future app screens and server-side routes without choosing a separate frontend/backend split now.
- TypeScript gives stronger guardrails for financial and permission logic.
- Module boundaries must be kept deliberately clean as the product grows.

