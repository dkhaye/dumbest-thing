#!/usr/bin/env bash
# Used by the demo tape to set up terraform state in a temp dir.
# Called as: bash setup-state.sh <dest-dir>
set -euo pipefail

DEST="$1"
mkdir -p "$DEST"

cat > "$DEST/main.tf" << 'INITEOF'
locals {
  names = ["alice", "bob", "charlie"]
}

resource "terraform_data" "server" {
  count = length(local.names)
  input = local.names[count.index]
}
INITEOF

cd "$DEST"
terraform init -input=false >/dev/null 2>&1
terraform apply -auto-approve -input=false >/dev/null 2>&1
