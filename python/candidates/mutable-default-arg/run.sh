#!/usr/bin/env bash
set -euo pipefail

PYTHON3="/opt/homebrew/bin/python3"

if ! command -v "$PYTHON3" >/dev/null 2>&1; then
  echo "error: python3 not found at $PYTHON3. Install Python 3 and ensure it is on PATH." >&2
  exit 1
fi

"$PYTHON3" "$(dirname "${BASH_SOURCE[0]}")/demo.py"
