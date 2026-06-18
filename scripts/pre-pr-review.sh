#!/bin/sh
set -eu

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT"

run_cmd() {
  name="$1"
  cmd="$2"
  echo "==> $name"
  sh -c "$cmd"
}

has_package_script() {
  script_name="$1"
  [ -f package.json ] || return 1
  command -v node >/dev/null 2>&1 || return 1
  node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['$script_name'] ? 0 : 1)"
}

package_runner() {
  if [ -f pnpm-lock.yaml ] && command -v pnpm >/dev/null 2>&1; then
    echo "pnpm"
  elif [ -f yarn.lock ] && command -v yarn >/dev/null 2>&1; then
    echo "yarn"
  elif [ -f package-lock.json ] && command -v npm >/dev/null 2>&1; then
    echo "npm"
  elif [ -f package.json ] && command -v npm >/dev/null 2>&1; then
    echo "npm"
  else
    echo ""
  fi
}

echo "Burgess pre-PR review"
echo "Repository: $ROOT"
echo

run_cmd "agent context" "./scripts/check-agent-context.sh"
run_cmd "ADR reminder check" "./scripts/check-adr-needed.sh"

runner=$(package_runner)
if [ -n "$runner" ] && [ -f package.json ]; then
  if [ "$runner" = "pnpm" ] && [ -f pnpm-lock.yaml ]; then
    run_cmd "install check" "pnpm install --frozen-lockfile --ignore-scripts"
  fi

  for script in lint typecheck test build; do
    if has_package_script "$script"; then
      run_cmd "package script: $script" "$runner run $script"
    else
      echo "TODO: package script not defined: $script"
    fi
  done
else
  echo "TODO: no package.json/package runner confirmed; lint/typecheck/test/build not run."
fi

echo
echo "Manual review reminders before PR:"
echo "- agent code review"
echo "- agent security review"
echo "- auth/permissions review"
echo "- customer data exposure review"
echo "- file/storage access review"
echo "- invoice/statement approval gate review"
echo
echo "pre-PR review complete."
