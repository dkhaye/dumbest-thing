# mutable default argument

**Status:** leading candidate, likely final slot

## Command

```
python3 demo.py
```

## Source

```python
def add(x, things=[]):
    things.append(x)
    return things


print(add(1))
print(add(2))
```

## Observed output

```
[1]
[1, 2]
```

## Explanation

Default argument values in Python are evaluated exactly once, at function
definition time, not on every call. `things=[]` creates a single list object
that is bound to the `things` parameter's default and then reused across
every call that doesn't pass its own `things` argument.

The first call, `add(1)`, appends `1` to that shared default list and
returns `[1]`. The second call, `add(2)`, appends `2` to the *same* list
object — not a fresh empty one — so it returns `[1, 2]`. Anyone reading the
function signature expects a clean list each time; the mutation silently
persists across calls instead.

## Documentation

- [Python tutorial: Default Argument Values](https://docs.python.org/3/tutorial/controlflow.html#default-argument-values)

## Tested version

- Python 3.14.7
- Verified 2026-09-21

## Stage notes

- ~20-25 seconds: show the function, run it twice, point at the second
  result carrying over the first call's data.
- No setup needed beyond a plain `python3` file or REPL.
