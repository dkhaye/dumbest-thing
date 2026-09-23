#!/usr/bin/env bash
# For every language's final/<beat>/ folder, records an asciinema .cast and
# renders a vhs demo.tape to MP4. Beat folders follow the pattern
# <lang>/final/<NN>-<name>/ and are processed in sorted order.
#
# Also copies rendered MP4s to videos/ with slide-order names:
#   <lang-num>-<lang>-<beat>.mp4  (e.g. 01-javascript-01-setup.mp4)
# so the flat folder alphasorts in talk order and can be uploaded to Drive as-is.
#
# Requires both asciinema and vhs on PATH.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/captures/final"
VIDEOS="$ROOT/videos"
mkdir -p "$OUT" "$VIDEOS"

# Presentation order — determines the lang-num prefix on exported video filenames.
# Add a language here when its final/ beats are built.
LANG_ORDER=(javascript php typescript rust sql terraform python)

for tool in asciinema vhs; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "error: $tool not found on PATH -- install it before running make capture" >&2
    exit 1
  fi
done

lang_index() {
  local target="$1"
  local i
  for i in "${!LANG_ORDER[@]}"; do
    if [ "${LANG_ORDER[$i]}" = "$target" ]; then
      printf "%02d" $((i + 1))
      return
    fi
  done
  printf "00"  # unknown language — sorts to top as a visible signal
}

for beat_dir in "$ROOT"/*/final/*/; do
  [ -f "$beat_dir/run.sh" ] || continue
  lang="$(basename "$(dirname "$(dirname "$beat_dir")")")"
  beat="$(basename "$beat_dir")"

  echo "== $lang/$beat =="

  (cd "$beat_dir" && asciinema rec --overwrite -c "bash run.sh" "$OUT/$lang-$beat.cast")

  if [ -f "$beat_dir/demo.tape" ]; then
    (cd "$beat_dir" && vhs demo.tape)
    echo "  rendered: $beat_dir/demo.mp4"

    lnum="$(lang_index "$lang")"
    dest="$VIDEOS/$lnum-$lang-$beat.mp4"
    cp "$beat_dir/demo.mp4" "$dest"
    echo "  exported: $dest"
  else
    echo "  no demo.tape -- skipping vhs render"
  fi
done
