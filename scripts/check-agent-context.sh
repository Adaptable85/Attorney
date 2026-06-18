#!/bin/sh
set -eu

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT"

required_files='
AGENTS.md
CLAUDE.md
.claude/rules/burgess-operating-constraints.md
.context/index.md
.context/project_overview.md
.context/agents.md
.context/task_management.md
.context/ai_memory.md
.context/conventions/index.md
.context/conventions/code-standards.md
.context/conventions/testing-and-quality.md
.context/conventions/documentation-standards.md
.context/workflows/index.md
.context/architecture/index.md
.context/rules/index.md
.context/rules/operating-constraints.md
.context/rules/learned-memories.mdc
docs/plans/_TEMPLATE.md
docs/architecture/README.md
docs/reviews/README.md
.githooks/pre-commit
.githooks/post-commit
.githooks/pre-push
scripts/check-agent-context.sh
scripts/check-agent-context-post-commit.sh
scripts/check-adr-needed.sh
scripts/pre-pr-review.sh
'

for file in $required_files; do
  [ -f "$file" ] || fail "Missing required file: $file"
done

required_dirs='
.claude/rules
.context/conventions
.context/workflows
.context/architecture
.context/rules
docs/plans
docs/architecture
docs/reviews
.githooks
scripts
'

for dir in $required_dirs; do
  [ -d "$dir" ] || fail "Missing required directory: $dir"
done

grep -q "Owner/principal attorney approval is mandatory" AGENTS.md || fail "AGENTS.md missing owner approval rule"
grep -q "OpenClaw/AI agents may draft" AGENTS.md || fail "AGENTS.md missing agent draft-only rule"
grep -q "Lexpro remains source of truth" AGENTS.md || fail "AGENTS.md missing Lexpro source-of-truth rule"
grep -q "No secrets in Git" AGENTS.md || fail "AGENTS.md missing no-secrets rule"

grep -q "Owner/principal attorney approval is mandatory" CLAUDE.md || fail "CLAUDE.md missing owner approval rule"
grep -q "OpenClaw/AI agents may draft" CLAUDE.md || fail "CLAUDE.md missing agent draft-only rule"
grep -q "Lexpro remains source of truth" CLAUDE.md || fail "CLAUDE.md missing Lexpro source-of-truth rule"
grep -q "No secrets in Git" CLAUDE.md || fail "CLAUDE.md missing no-secrets rule"

for script in .githooks/pre-commit .githooks/post-commit .githooks/pre-push scripts/check-agent-context.sh scripts/check-agent-context-post-commit.sh scripts/check-adr-needed.sh scripts/pre-pr-review.sh; do
  [ -x "$script" ] || fail "Script/hook is not executable: $script"
done

echo "Agent context check passed."

