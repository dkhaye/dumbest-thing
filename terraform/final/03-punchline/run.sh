#!/usr/bin/env bash
set -euo pipefail

if ! command -v terraform >/dev/null 2>&1; then
  echo "error: terraform not found on PATH. Install Terraform." >&2
  exit 1
fi

BEAT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

normalize() {
  grep -v ': Refreshing state\.\.\.' \
    | sed -E 's/\[id=[0-9a-f-]+\]/[id=<redacted>]/g; s/"[0-9a-f-]{36}"/"<redacted>"/g'
}

# Create initial state: alice, bob, charlie
cat > "$WORKDIR/main.tf" << 'INITIAL_EOF'
locals {
  names = ["alice", "bob", "charlie"]
}

resource "terraform_data" "server" {
  count = length(local.names)
  input = local.names[count.index]
}
INITIAL_EOF

(
  cd "$WORKDIR"
  terraform init -input=false >/dev/null 2>&1
  terraform apply -auto-approve -input=false >/dev/null 2>&1

  # Remove alice — now only bob and charlie
  cp "$BEAT_DIR/main.tf" main.tf

  terraform plan -input=false -no-color 2>&1
) | normalize
