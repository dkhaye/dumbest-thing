# Python — `finally: return` silently discards the exception

**Status:** leading candidate — replaces mutable-default-arg as the "real
thing" beat in the Python bit (brew install joke -> spacebar joke -> this)

## Command

```
bash run.sh
```

## Source

```python
def get_value():
    try:
        raise ValueError("boom, something actually broke")
    finally:
        return 2


print(get_value())
```

## Observed output

```
2
```

The `ValueError` never surfaces anywhere. No traceback, no exit code
change, nothing on stderr (with the interpreter's warning suppressed —
see Caveats). The function just... returns `2`.

## Explanation

A `finally` clause always runs before control leaves a `try` statement,
even when the `try` block raised an exception that was never caught by an
`except`. If that in-flight exception was about to propagate out of the
function, and the `finally` clause itself executes a `return` (or `break`
or `continue`), the exception is discarded outright — the `return` value
from `finally` overrides everything, silently. The exception isn't
caught, logged, or re-raised. It simply ceases to exist.

The code looks completely reasonable: a `finally` block that guarantees
some value comes back no matter what happened in the `try` — a pattern
someone might write specifically *because* they want the function to
"always return something." That defensive instinct is exactly what
swallows the bug report.

## Documentation

- [Python language reference: the `finally` clause](https://docs.python.org/3/reference/compound_stmts.html#finally-clause) — "If the `finally` clause executes a `return`, `break` or `continue` statement, saved exceptions are discarded."
- [Python tutorial: 8.7 Defining Clean-up Actions](https://docs.python.org/3/tutorial/errors.html#defining-clean-up-actions) — explicitly warns this pattern "can lead to confusing behavior."

## Tested version

- Python 3.14.7 (Homebrew) — emits `SyntaxWarning: 'return' in a 'finally' block` on stderr, new in 3.14
- Cross-checked on Python 3.13.15 (Homebrew) — **identical `2` result, zero warning of any kind**
- Verified 2026-09-22

## Caveats

- Python 3.14 is the *first* version in the language's history to warn
  about this at all (a `SyntaxWarning`, not an error) — every version
  before it, going back to Python's original `try/finally` semantics,
  swallows the exception with no diagnostic whatsoever. `run.sh` passes
  `-W ignore::SyntaxWarning` so `expected.txt` stays identical across
  interpreter versions; the warning's existence (and its absence on every
  version before 3.14) is a spoken beat, not part of the recorded output.

## Stage notes

- ~25-30 seconds: show the function, point out it raises a real
  exception, run it, land on the bare `2` with nothing else printed.
- Punchline: "That exception didn't get caught. It didn't get logged. It
  just stopped existing. Python didn't even warn you about this until
  3.14 — which shipped last year."
- This is the "real thing" after the brew-install-python3 bit and the
  spacebar-three-times bit — the escalation from "ha, dumb joke" to
  "wait, that's actually horrifying" the doc's structure wants for a
  closing beat in a segment.
