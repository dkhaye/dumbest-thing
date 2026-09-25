#!/usr/bin/env bash
set -euo pipefail

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "error: sqlite3 not found on PATH." >&2
  exit 1
fi

DIR="$(dirname "${BASH_SOURCE[0]}")"
TMPDB=$(mktemp /tmp/sql-demo-XXXXXX.db)
trap 'rm -f "$TMPDB"' EXIT

sqlite3 "$TMPDB" < "$DIR/demo.sql"
sqlite3 -header -column -nullvalue NULL "$TMPDB" \
  "SELECT name FROM employees WHERE id NOT IN (1, 2, 3);" \
  | sed 's/[[:space:]]*$//'
