# The Dumbest Thing You Can Do in Every Programming Language

Evidence and production repo for a lightning talk:
reasonable-looking code, real interpreters, immediate betrayal. See
`docs/HANDOFF.md` for the full research brief, scoring criteria, and
candidate history. See `SCRIPT.md` for the verbatim speaker script.

## The six languages (talk order)

JavaScript → TypeScript → PHP → SQL → Terraform → Python. Each has a
`final/` beat sequence (3 beats; Python and SQL have 4) recorded as vhs tapes
and stitched into `slides.pptx` by `scripts/build-slides.ts`.

Rust was cut to fit the 5-minute slot — its videos took the longest to
record/render of any language and it was the weakest joke of the pool.
`rust/candidates/` is kept as a documented backlog idea; `rust/final/` was
removed. `go/` and `tcl/` have candidates but no `final/` — deferred
speed-round material, never in the talk. `ruby/` has one candidate
(`reopen-integer`) kept as a documented backlog idea; it briefly had a
`final/` beat sequence during an abandoned Rust→Ruby swap that was reverted,
and has since been pulled back down to candidate-only.

## Layout

```
dumbest-thing/
├── SCRIPT.md            # verbatim speaker script, one section per language
├── docs/HANDOFF.md      # research brief, candidate pool, decisions
├── scripts/
│   ├── check-tools.sh    # report installed tools and versions
│   ├── run-all.sh        # run every candidate's run.sh and diff expected.txt
│   ├── capture-final.sh  # generate asciinema casts + vhs renders for final/
│   └── build-slides.ts   # assemble slides.pptx from videos/ + LANG_META notes
├── captures/final/      # generated .cast and .gif/.mp4 for shortlisted demos
├── videos/              # flat, slide-order-named MP4 exports (generated, gitignored)
├── slides.pptx          # generated deck (gitignored) — open once in Keynote, Save as slides.key
└── <language>/
    ├── README.md        # claim, command, output, explanation, sources, stage notes
    ├── candidates/       # one minimal file per candidate
    │   └── <name>/       # demo source, run.sh, expected.txt, README.md
    └── final/            # selected demo only, once chosen — one dir per beat
        └── <NN-beat>/    # demo source, run.sh, expected.txt, demo.tape, demo.mp4 (generated)
```

Every `final/` beat directory name is `<NN>-<slug>` (e.g. `02-build`,
`03-punchline`) and must be unique within that language — `capture-final.sh`
derives the exported video filename directly from the directory name, so a
duplicate slug produces a silent filename collision in `videos/`.

## Commands

```
make doctor    # report installed tools and versions
make verify    # run every candidate and diff against expected.txt
make final     # run only the shortlisted demos
make capture   # produce asciinema .cast recordings + vhs renders for final/
make keynote   # capture (if stale) → build slides.pptx → open in Keynote
make clean     # wipe videos/, .last-capture, slides.pptx, and all demo.mp4s
```

## CI

- `.github/workflows/verify.yml` — runs `make verify` and `shellcheck` on every `run.sh`, on push to `main` and every PR.
- `.github/workflows/lint-workflows.yml` — standalone actionlint check on any PR touching `.github/workflows/**`. Deliberately not wired into `verify.yml`, so a broken workflow file still gets caught even if `verify.yml` itself fails to parse.
- Third-party actions are pinned to a full commit SHA with the version as a trailing comment (e.g. `actions/checkout@<sha> # v7.0.1`), not a semver tag or branch.

## Rules

- Every candidate must be reproducible offline, from checked-in source only.
- `run.sh` must fail loudly (nonzero exit, clear message) if its interpreter/compiler is missing.
- Never hand-edit output to make a joke land. If it needs edits, the candidate is rejected.
- Pin or record tool versions. If behavior changes across versions, say so in the README or reject the candidate.
- Demo tapes must use the language's interactive REPL (typed live on camera), not `cat file && run`. See `.claude/CLAUDE.md` for the full set of tape invariants, including the no-REPL exceptions (Terraform, Rust heredoc).
