#!/usr/bin/env bash
set -uo pipefail

if ! command -v rustc >/dev/null 2>&1; then
  echo "error: rustc not found on PATH. Install Rust (rustup)." >&2
  exit 1
fi

cd "$(dirname "${BASH_SOURCE[0]}")"

TMPBIN=$(mktemp /tmp/demo-rs-XXXXXX)
trap 'rm -f "$TMPBIN"' EXIT

rustc -o "$TMPBIN" demo.rs
# The panic message includes the OS thread ID (varies per run); normalize it.
set +e
"$TMPBIN" 2>&1 | grep -v '^note: run with' | sed -E "s/thread 'main' \([0-9]+\)/thread 'main' (PID)/"
status=${PIPESTATUS[0]}
set -e
echo "exit: $status"
