# The Dumbest Thing You Can Do in Every Programming Language

Evidence and production repo for a 5-minute lightning talk: reasonable-looking
code, real interpreters, immediate betrayal. See `docs/HANDOFF.md` for the
full research brief, scoring criteria, and candidate history.

## Layout

```
dumbest-thing/
├── docs/HANDOFF.md      # research brief, candidate pool, decisions
├── scripts/
│   ├── check-tools.sh   # report installed tools and versions
│   ├── run-all.sh       # run every candidate's run.sh and diff expected.txt
│   └── capture-final.sh # generate asciinema casts + vhs renders for final/
├── captures/final/      # generated .cast and .gif/.mp4 for shortlisted demos
└── <language>/
    ├── README.md        # claim, command, output, explanation, sources, stage notes
    ├── run.sh            # deterministic one-command reproduction, fails loudly if tooling is missing
    ├── expected.txt       # exact or normalized output
    ├── candidates/       # one minimal file per candidate
    └── final/            # selected demo only, once chosen
```

## Commands

```
make doctor    # report installed tools and versions
make verify    # run every candidate and diff against expected.txt
make final     # run only the shortlisted demos
make capture   # produce asciinema .cast recordings + vhs renders for final/
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
