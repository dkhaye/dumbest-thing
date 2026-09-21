#!/usr/bin/env bash
# For every language with a final/ demo, records an asciinema .cast (proof
# the output came from a real run) and renders a vhs .tape to GIF/MP4 (the
# polished artifact embedded in slides). Requires both tools on PATH.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/captures/final"
mkdir -p "$OUT"

for tool in asciinema vhs; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "error: $tool not found on PATH -- install it before running make capture" >&2
    exit 1
  fi
done

for lang_dir in "$ROOT"/*/final/; do
  [ -f "$lang_dir/run.sh" ] || continue
  lang="$(basename "$(dirname "$lang_dir")")"

  echo "== $lang =="

  (cd "$lang_dir" && asciinema rec --overwrite -c "bash run.sh" "$OUT/$lang.cast")

  tape="$lang_dir/demo.tape"
  if [ -f "$tape" ]; then
    (cd "$lang_dir" && vhs "demo.tape" -o "$OUT/$lang.gif")
  else
    echo "  no demo.tape in $lang_dir -- skipping vhs render"
  fi
done
