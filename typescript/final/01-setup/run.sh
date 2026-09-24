#!/usr/bin/env bash
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  source "$NVM_DIR/nvm.sh"
  nvm use default >/dev/null
fi

if ! command -v node >/dev/null 2>&1; then
  echo "error: node not found. Install nvm and run 'nvm install --lts'." >&2
  exit 1
fi

BEAT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TS_DIR="$(cd "$BEAT_DIR/../.." && pwd)"
TSC="$TS_DIR/node_modules/.bin/tsc"

if [ ! -f "$TSC" ]; then
  echo "error: tsc not found. Run 'npm install --prefix typescript' in the repo root." >&2
  exit 1
fi

cd "$BEAT_DIR"
# Type error is expected — capture it and exit 0 so run-all considers this a pass
set +e
"$TSC" --noEmit demo.ts
set -e
exit 0
