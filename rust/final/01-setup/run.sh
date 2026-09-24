#!/usr/bin/env bash
set -euo pipefail

if ! command -v rustc >/dev/null 2>&1; then
  echo "error: rustc not found on PATH. Install Rust (rustup)." >&2
  exit 1
fi

cd "$(dirname "${BASH_SOURCE[0]}")"

TMPBIN=$(mktemp /tmp/demo-rs-XXXXXX)
trap 'rm -f "$TMPBIN"' EXIT

rustc -o "$TMPBIN" demo.rs 2>/dev/null
# Capture stdout only — the panic goes to stderr and is intentionally suppressed here.
# The binary exits nonzero (panic) so we swallow that exit code.
"$TMPBIN" 2>/dev/null || true
