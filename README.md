# The Dumbest Thing You Can Do in Every Programming Language

Reasonable-looking code, real interpreters, immediate betrayal.

This is the evidence-and-production repo for a five-minute lightning talk
about language-specific footguns: code that a competent developer might
plausibly write, that the language happily accepts, and that then does
something wonderfully stupid. Every demo here is a real, minimal,
offline-reproducible program with recorded output. Nothing is faked, and
no output is hand-edited to make a joke land.

## The demos

The six that made the talk, in order:

| # | Language | The betrayal | Source |
|---|----------|--------------|--------|
| 1 | JavaScript | `["1","2","3"].map(parseInt)` returns `[ 1, NaN, NaN ]` — `map` passes the index, and `parseInt` reads it as the radix | [`javascript/`](javascript/) |
| 2 | TypeScript | An object literal with an extra property is a type error; put the same object in a variable first and it passes | [`typescript/`](typescript/) |
| 3 | PHP | `true`, `1`, `1.9`, and `"1"` all coerce to the same array key, so four writes leave one entry | [`php/`](php/) |
| 4 | SQL | `NOT IN (subquery)` returns zero rows if the subquery yields a `NULL`, because the comparison is UNKNOWN, not false | [`sql/`](sql/) |
| 5 | Terraform | Removing the first item of a `count` list makes every later resource shift identity: update, update, destroy | [`terraform/`](terraform/) |
| 6 | Python | `return` inside `finally` silently discards the in-flight exception | [`python/`](python/) |

Verified but not used ("candidates", kept as a backlog of ideas):

| Language | Candidate | Why it didn't make the talk |
|----------|-----------|-----------------------------|
| Go | [typed nil interface is not nil](go/candidates/typed-nil-interface/) | Needs more explanation than the time slot allowed |
| Tcl | [scalar/array variable collision](tcl/candidates/scalar-array-collision/) | Never found a slot that justified the setup |
| Ruby | [reopen `Integer` and replace `+`](ruby/candidates/reopen-integer/) | Deliberate rather than accidental |
| Rust | [`RefCell` borrow panic](rust/candidates/refcell-borrow-panic/) | Cut for time; slowest to record, weakest joke |
| Python | [mutable default argument](python/candidates/mutable-default-arg/) | Too famous — the room sees it coming |

Each candidate and final beat has its own `README.md` with the exact command,
observed output, explanation, documentation links, and tested version.

## Try it

```sh
make verify   # run every candidate and diff its output against expected.txt
make final    # run only the six demos used in the talk
make doctor   # report which language toolchains are installed
```

Each demo is just a directory with a source file, a `run.sh`, and an
`expected.txt`, so you can also run one directly:

```sh
cd javascript/candidates/map-parseint && bash run.sh
```

### Prerequisites

Only the toolchains for the languages you want to run:

`node`, `python3`, `go`, `cargo`, `tclsh`, `ruby`, `php`, `sqlite3`,
`terraform`. TypeScript demos use a local `typescript/package.json`
(`make final` installs it; otherwise `npm install --prefix typescript`).
`make doctor` lists what is and isn't installed. Each `run.sh` exits nonzero
with a clear message if its interpreter is missing.

Pinned versions, where behavior could plausibly vary, are recorded in each
demo's README. The Ruby demo prefers rbenv's 3.1.2 if present and falls back
to whatever `ruby` is on `PATH`.

## Building the talk

Only needed if you want to regenerate the recordings and slide deck. The
`final/` beats are recorded as terminal videos and stitched into a deck.

Additional requirements: [`asciinema`](https://asciinema.org/),
[`vhs`](https://github.com/charmbracelet/vhs) **pinned to 0.11.0** (newer
versions change directive support; tapes here avoid `Set Background`,
`Set Rows`, and `Set Columns`), and macOS Keynote to open the generated deck.

```sh
make capture   # asciinema casts + vhs renders for every final/ beat
make keynote   # capture (if stale) → build slides.pptx → open it
make clean     # wipe videos/, slides.pptx, captures, and all demo.mp4s
```

`make keynote` produces `slides.pptx` (gitignored). Open it once in Keynote
and Save As `slides.key`. If you rename or re-number beats, run `make clean`
first so stale videos from the old names don't end up in the deck.

## Layout

```
dumbest-thing/
├── SCRIPT.md            # the speaker script, one section per language
├── scripts/
│   ├── check-tools.sh    # report installed tools and versions
│   ├── run-all.sh        # run every run.sh and diff against expected.txt
│   ├── capture-final.sh  # asciinema casts + vhs renders for final/
│   └── build-slides.ts   # assemble slides.pptx from videos/ and the notes in LANG_META
├── captures/final/      # generated .cast files (gitignored)
├── videos/              # flat, slide-order-named MP4 exports (generated, gitignored)
└── <language>/
    ├── README.md        # language overview
    ├── candidates/
    │   └── <name>/      # demo source, run.sh, expected.txt, README.md
    └── final/           # only for languages used in the talk — one dir per beat
        └── <NN-beat>/   # demo source, run.sh, expected.txt, demo.tape
```

`final/` beat directories are named `<NN>-<slug>` (e.g. `02-build`) and must
be unique within a language: `capture-final.sh` derives the exported video
filename from the directory name, so a duplicate slug silently collides in
`videos/`.

## Rules for new demos

- Reproducible offline, from checked-in source only.
- `run.sh` fails loudly (nonzero exit, clear message) if its interpreter or compiler is missing.
- Never hand-edit output to make a joke land. If it needs edits, the candidate is rejected.
- Pin or record tool versions. If behavior changes across versions, say so in the README or reject the candidate.
- Demo tapes use the language's interactive REPL, typed live on camera, not `cat file && run`. Terraform and Go have no REPL and are the exceptions. See [`.claude/CLAUDE.md`](.claude/CLAUDE.md) for the full set of tape invariants.

## What makes a good one

- The input looks reasonable enough that a competent developer might write it.
- The language accepts it without an obviously malicious or contrived stunt.
- The result is surprising on sight and explainable in one or two sentences.
- The behavior is current, documented or spec-defensible, and reproduced locally.
- It reveals something characteristic of *this* language, not generic programmer error.

## License

Copyright 2026 David Haye. Licensed under the [Apache License, Version 2.0](LICENSE).

## CI

- [`verify.yml`](.github/workflows/verify.yml) — runs `make verify` and `shellcheck` on every `run.sh`, on push to `main` and on every PR.
- [`lint-workflows.yml`](.github/workflows/lint-workflows.yml) — standalone `actionlint` on any PR touching `.github/workflows/**`. Deliberately separate from `verify.yml`, so a broken workflow file is still caught even if `verify.yml` itself fails to parse.
- Third-party actions are pinned to a full commit SHA with the version as a trailing comment, not a tag or branch.
