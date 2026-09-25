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

node "$(dirname "${BASH_SOURCE[0]}")/demo.js"
