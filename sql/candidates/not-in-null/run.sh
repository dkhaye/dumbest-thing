#!/usr/bin/env bash
set -euo pipefail

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "error: sqlite3 not found on PATH." >&2
  exit 1
fi

sqlite3 -header -column ":memory:" < "$(dirname "${BASH_SOURCE[0]}")/demo.sql"
