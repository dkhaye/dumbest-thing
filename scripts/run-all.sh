#!/usr/bin/env bash
# Runs every candidate's run.sh (or, if "final", only final/<beat>/run.sh) and
# diffs its output against expected.txt. Exits nonzero if any candidate fails
# or diverges from its recorded output.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-all}" # "all" or "final"

fail_count=0
pass_count=0

indent() {
  local line
  while IFS= read -r line; do
    echo "      $line"
  done
}

for lang_dir in "$ROOT"/*/; do
  lang="$(basename "$lang_dir")"
  case "$lang" in
    scripts|captures|docs) continue ;;
  esac

  if [ "$MODE" = "final" ]; then
    dirs=("$lang_dir"/final/*/)
  else
    dirs=("$lang_dir"/candidates/*/)
  fi

  for dir in "${dirs[@]}"; do
    [ -d "$dir" ] || continue
    run="$dir/run.sh"
    expected="$dir/expected.txt"
    [ -f "$run" ] || continue

    name="$lang/$(basename "$dir")"
    actual="$(cd "$dir" && bash run.sh 2>&1)"
    status=$?

    if [ $status -ne 0 ]; then
      echo "FAIL  $name (run.sh exited $status)"
      echo "$actual" | indent
      fail_count=$((fail_count + 1))
      continue
    fi

    if [ -f "$expected" ]; then
      if [ "$actual" = "$(cat "$expected")" ]; then
        echo "PASS  $name"
        pass_count=$((pass_count + 1))
      else
        echo "FAIL  $name (output != expected.txt)"
        diff <(echo "$actual") "$expected" | indent
        fail_count=$((fail_count + 1))
      fi
    else
      echo "WARN  $name (no expected.txt, output not checked)"
      pass_count=$((pass_count + 1))
    fi
  done
done

echo
echo "$pass_count passed, $fail_count failed"
[ "$fail_count" -eq 0 ]
