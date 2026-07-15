# Context Index

Status: Phase 10A GhostPractice-inspired admin workflow and visual redesign

Read order:

1. `project_overview.md`
2. `rules/operating-constraints.md`
3. `agents.md`
4. `task_management.md`
5. `conventions/index.md`
6. `workflows/index.md`
7. `architecture/index.md`
8. `ai_memory.md`

Supporting folders:

- `conventions/` contains coding, testing and documentation standards.
- `workflows/` contains process expectations for future phases.
- `architecture/` contains architecture notes and future decisions.
- `rules/` contains always-applicable safety constraints and learned memories.

Validation:

```sh
./scripts/check-agent-context.sh
pnpm run pre-pr
```

Package commands:

```sh
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run test:db
pnpm run test:coverage
pnpm run build
```

One-time hook setup:

```sh
git config core.hooksPath .githooks
```
