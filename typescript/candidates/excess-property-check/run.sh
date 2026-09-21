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

CANDIDATE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TS_DIR="$(cd "$CANDIDATE_DIR/../.." && pwd)"

if [ ! -d "$TS_DIR/node_modules/typescript" ]; then
  echo "error: typescript not installed. Run 'npm install' in $TS_DIR." >&2
  exit 1
fi

cd "$TS_DIR"

echo "=== error.ts ==="
set +e
npx --no-install tsc --noEmit --strict candidates/excess-property-check/error.ts
error_status=$?
set -e
echo "exit: $error_status"

echo "=== pass.ts ==="
set +e
npx --no-install tsc --noEmit --strict candidates/excess-property-check/pass.ts
pass_status=$?
set -e
echo "exit: $pass_status"
