# Python — finally swallows exception

## Pre-video spoken bits (no video needed)

1. "The dumbest thing in Python is `brew install python3`" — [pause for laughs]
2. "Ok, but actually — you know Python is whitespace-sensitive. It's not two
   spaces or four spaces. It's exactly three." — [type three spaces on stage]

## Video beats

| Slide | Type | On-screen | Speaker line |
|-------|------|-----------|--------------|
| 1 | Title | "Python" | Alright — Python. |
| 2 | Video | `def loud()` / `loud()` → traceback | Exceptions propagate out of try blocks. Expected. |
| 3 | Video | `def silent()` / `silent()` → `2` | Same raise. No traceback. Returns 2. The exception just stopped existing. Python didn't even warn you about this until 3.14 — which shipped last year. |
| 4 | Explanation | `finally: return` discards exception | [explain the mechanism] |
