#!/bin/sh
set -eu

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT"

echo "post-commit: Burgess operating constraints remain active."
echo "Reminder: install hooks once with: git config core.hooksPath .githooks"
echo "Reminder: run ./scripts/pre-pr-review.sh before review or push."

