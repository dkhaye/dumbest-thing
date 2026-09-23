#!/usr/bin/env bash
set -euo pipefail

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 not found on PATH. Install Python 3." >&2
  exit 1
fi

# -W ignore::SyntaxWarning: Python 3.14+ warns about 'return' in a finally
# block (see README) -- suppressed here so expected.txt is stable across
# interpreter versions; the warning itself is a stage-note beat, not part
# of the recorded output.
python3 -W ignore::SyntaxWarning "$(dirname "${BASH_SOURCE[0]}")/demo.py"
