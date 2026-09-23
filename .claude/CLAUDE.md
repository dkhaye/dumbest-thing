# dumbest-thing

Repo layout, rules, and CI are documented in `README.md` and
`docs/HANDOFF.md` — read those first.

If a file `.local/CONTEXT.md` exists in this repo, read it at the start
of the session. It holds session-to-session handoff notes (in-progress
state, decisions, next steps) for whoever is driving Claude Code here.
It's gitignored — local only, never pushed to GitHub — so its absence is
normal for a fresh clone or a collaborator who hasn't generated one yet.

## Demo tape invariants — NEVER break these

Every VHS tape for a language demo MUST follow these rules without exception:

1. **Use the language's interactive REPL.** The audience must see code being
   typed live, not a file being cat'd and run.
   - JavaScript → `node`
   - PHP → `php -a`
   - Python → `python3`
   - SQL/SQLite → `sqlite3 <db>`
   - TypeScript → `npx ts-node` (or node if ts-node unavailable)
   - Rust → `evcxr` if available; otherwise a typed heredoc (no cat)
   - Terraform/Go — no REPL exists; acceptable to use file + run, but
     the file content must be typed live if short enough

2. **The REPL launch command is always typed visibly.** `node`, `php -a`,
   `sqlite3 demo.db`, `python3` — these appear in the recording.

3. **All in-REPL setup is hidden.** Formatting commands (`.headers on`),
   config (`.mode column`), etc. go in the `Hide` block BEFORE the REPL
   launch — via aliases, env vars, init files, or a `Hide` section that
   runs them and then `.shell clear`s before `Show`.

4. **`cat file` is forbidden** unless the language genuinely has no REPL
   (Terraform, Makefile, etc.).

5. **Beat 02 hidden section replays beat 01.** First visible frame of beat
   02 must match beat 01's last frame for seamless continuation.

6. **vhs is pinned to 0.11.0.** Do not use `Set Background`, `Set Rows`,
   `Set Columns`, or any directive not confirmed to exist in 0.11.0. Check
   the existing tapes for valid directive examples before adding new ones.
