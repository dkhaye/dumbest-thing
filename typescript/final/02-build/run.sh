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
TS_NODE="$TS_DIR/node_modules/.bin/ts-node"

if [ ! -f "$TS_NODE" ]; then
  echo "error: ts-node not found. Run 'npm install --prefix typescript' in the repo root." >&2
  exit 1
fi

"$TS_NODE" "$BEAT_DIR/demo.ts"
