#!/usr/bin/env bash
set -uo pipefail

if ! command -v cargo >/dev/null 2>&1; then
  echo "error: cargo not found on PATH. Install Rust (rustup)." >&2
  exit 1
fi

cd "$(dirname "${BASH_SOURCE[0]}")"

# Rust's panic message includes the OS thread ID (varies per run); normalize
# it to a fixed placeholder so output is deterministic.
set +e
cargo run --quiet 2>&1 | grep -v '^note: run with' | sed -E "s/thread 'main' \([0-9]+\)/thread 'main' (PID)/"
status=${PIPESTATUS[0]}
set -e
echo "exit: $status"
