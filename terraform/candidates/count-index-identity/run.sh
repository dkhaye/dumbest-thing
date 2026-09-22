#!/usr/bin/env bash
set -euo pipefail

if ! command -v terraform >/dev/null 2>&1; then
  echo "error: terraform not found on PATH. Install Terraform." >&2
  exit 1
fi

CANDIDATE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

# terraform_data is a core resource (no provider download, no network) --
# it exists purely to give a resource identity to observe, with no real
# infrastructure behind it. State lives only in $WORKDIR, never committed.
normalize() {
  grep -v ': Refreshing state\.\.\.' \
    | sed -E 's/\[id=[0-9a-f-]+\]/[id=<redacted>]/g; s/"[0-9a-f-]{36}"/"<redacted>"/g'
}

run_variant() {
  local variant="$1"
  local dir="$WORKDIR/$variant"
  mkdir -p "$dir"
  cp "$CANDIDATE_DIR/$variant/main.tf" "$dir/main.tf"

  (
    cd "$dir"
    terraform init -input=false >/dev/null
    terraform apply -auto-approve -input=false \
      -var='servers=["alpha","beta","gamma"]' >/dev/null
    terraform plan -input=false -no-color \
      -var='servers=["beta","gamma"]'
  ) | normalize
}

echo "=== count ==="
run_variant count
echo
echo "=== for_each ==="
run_variant for_each
