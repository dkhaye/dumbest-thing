#!/usr/bin/env bash
set -uo pipefail

if ! command -v tclsh >/dev/null 2>&1; then
  echo "error: tclsh not found on PATH. Install Tcl." >&2
  exit 1
fi

set +e
tclsh "$(dirname "${BASH_SOURCE[0]}")/demo.tcl"
status=$?
set -e
echo "exit: $status"
