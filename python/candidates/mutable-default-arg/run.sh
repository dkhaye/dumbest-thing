#!/usr/bin/env bash
set -euo pipefail

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 not found on PATH. Install Python 3." >&2
  exit 1
fi

python3 "$(dirname "${BASH_SOURCE[0]}")/demo.py"
