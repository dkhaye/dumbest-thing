#!/usr/bin/env bash
set -euo pipefail

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 not found." >&2
  exit 1
fi

# Beat 01 is a visual joke — no program runs. Echo the punchline setup line.
echo "brew install python3"
