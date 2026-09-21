#!/usr/bin/env bash
set -euo pipefail

if ! command -v go >/dev/null 2>&1; then
  echo "error: go not found. Install Go and ensure it is on PATH." >&2
  exit 1
fi

go run "$(dirname "${BASH_SOURCE[0]}")/demo.go"
