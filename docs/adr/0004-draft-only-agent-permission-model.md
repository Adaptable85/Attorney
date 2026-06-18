# 0004: Draft-Only Agent Permission Model

Status: Accepted
Date: 2026-06-18

## Context

OpenClaw/AI agents may help capture instructions, transcribe, draft, classify, research and route work. The platform will handle sensitive legal, client and financial information.

## Decision

Agents are draft-only service users by default.

Agents may not approve, send, publish, delete protected records, override accounting data, assign official invoice numbers or provide final legal advice.

## Consequences

- Owner/principal approval remains the control point for sensitive actions.
- Agent-created work must be traceable and auditable.
- Future permissions must enforce this server-side, not only in the UI.

