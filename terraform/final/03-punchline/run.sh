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
  grep -v ': Refreshing state\.\.\.'
}

cp "$BEAT_DIR/main.tf" "$WORKDIR/main.tf"

(
  cd "$WORKDIR"
  terraform init -input=false >/dev/null 2>&1
  terraform apply -auto-approve -input=false >/dev/null 2>&1
  terraform plan -input=false -no-color 2>&1
) | normalize
