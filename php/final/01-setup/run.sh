#!/usr/bin/env bash
set -euo pipefail

if ! command -v php >/dev/null 2>&1; then
  echo "error: php not found. Install PHP (e.g. 'brew install php')." >&2
  exit 1
fi

php "$(dirname "${BASH_SOURCE[0]}")/demo.php"
