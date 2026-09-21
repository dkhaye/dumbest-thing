#!/usr/bin/env bash
# Reports installed tool versions for every language in scope. Does not fail
# on missing tools -- run.sh scripts are responsible for failing loudly when
# something they specifically need is absent.
set -uo pipefail

# nvm manages node/npm/npx here; load it so PATH resolution matches how
# javascript/typescript run.sh scripts will invoke node.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  source "$NVM_DIR/nvm.sh"
  nvm use default >/dev/null 2>&1
fi

check() {
  local name="$1"
  local cmd="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    printf "%-12s %s\n" "$name" "$("$cmd" "${3:---version}" 2>&1 | head -1)"
  else
    printf "%-12s MISSING\n" "$name"
  fi
}

echo "== language toolchains =="
check "node"       node
check "npx"        npx
check "python3"    python3
check "go"         go
check "rustc"      rustc
check "cargo"      cargo
check "tclsh"      tclsh
check "ruby"       ruby
check "php"        php
check "sqlite3"    sqlite3
check "psql"       psql
check "terraform"  terraform

echo
echo "== typescript (local, via npx) =="
if npx --no-install tsc --version >/dev/null 2>&1; then
  printf "%-12s %s\n" "tsc" "$(npx --no-install tsc --version 2>&1)"
else
  printf "%-12s %s\n" "tsc" "not installed locally -- run 'npm install' in typescript/"
fi

echo
echo "== capture tooling =="
check "asciinema"  asciinema
check "vhs"        vhs
