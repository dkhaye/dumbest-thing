#!/usr/bin/env bash
set -euo pipefail

RBENV_ROOT="${RBENV_ROOT:-$HOME/.rbenv}"
RUBY_VERSION="3.1.2"
RUBY_BIN="$RBENV_ROOT/versions/$RUBY_VERSION/bin/ruby"

if ! command -v rbenv >/dev/null 2>&1 && [ ! -x "$RUBY_BIN" ]; then
  echo "error: rbenv not found and $RUBY_BIN does not exist. Install rbenv and 'rbenv install $RUBY_VERSION'." >&2
  exit 1
fi

if [ ! -x "$RUBY_BIN" ]; then
  echo "error: ruby $RUBY_VERSION not found at $RUBY_BIN. Run 'rbenv install $RUBY_VERSION'." >&2
  exit 1
fi

actual_version="$("$RUBY_BIN" --version 2>&1)"
case "$actual_version" in
  ruby\ 3.1.2*) ;;
  *)
    echo "error: expected ruby 3.1.2 at $RUBY_BIN but got: $actual_version" >&2
    exit 1
    ;;
esac

"$RUBY_BIN" "$(dirname "${BASH_SOURCE[0]}")/demo.rb"
