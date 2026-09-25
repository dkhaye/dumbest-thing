#!/usr/bin/env bash
set -euo pipefail

RBENV_ROOT="${RBENV_ROOT:-$HOME/.rbenv}"
PINNED_RUBY="$RBENV_ROOT/versions/3.1.2/bin/ruby"

if [ -x "$PINNED_RUBY" ]; then
  RUBY_BIN="$PINNED_RUBY"
elif command -v ruby >/dev/null 2>&1; then
  RUBY_BIN="$(command -v ruby)"
else
  echo "error: no ruby found. Install rbenv + ruby 3.1.2, or install ruby and put it on PATH." >&2
  exit 1
fi

"$RUBY_BIN" "$(dirname "${BASH_SOURCE[0]}")/demo.rb"
