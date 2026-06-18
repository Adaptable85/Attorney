#!/bin/sh
set -eu

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$ROOT"

if [ -d docs/adr ]; then
  echo "ADR directory exists."
else
  echo "ADR reminder: create docs/adr/ only when the first ADR is accepted/needed."
fi

echo "ADR rule: recommend an ADR only when the decision is hard to reverse, surprising without context, and came from a real trade-off."

exit 0
