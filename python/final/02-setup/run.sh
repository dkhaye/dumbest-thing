#!/usr/bin/env bash
set -euo pipefail

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 not found on PATH. Install Python 3." >&2
  exit 1
fi

# loud() raises an uncaught exception — capture traceback on stderr and
# normalize the absolute path so expected.txt is stable across machines.
# || true: python3 exits nonzero on uncaught exception; we need exit 0
# for make verify.
python3 "$(dirname "${BASH_SOURCE[0]}")/demo.py" 2>&1 \
  | sed 's|  File ".*/demo\.py"|  File "demo.py"|g' \
  || true
