# Tcl — a variable name can be a scalar or an array, but not both

**Status:** leading candidate — resolves the doc's open Tcl question

## Command

```
tclsh demo.tcl
```

## Source

```tcl
array set config {debug 1 verbose 0}
puts "config(debug) = $config(debug)"

set config "reset"
```

## Observed output

```
config(debug) = 1
can't set "config": variable is array
    while executing
"set config "reset""
    (file "./demo.tcl" line 4)
exit: 1
```

## Explanation

In Tcl, a variable name is bound to exactly one storage kind at a time: a
plain scalar value, or an associative array — never both. `config` becomes
an array the moment `array set config {...}` runs. The later line
`set config "reset"` looks like an entirely ordinary variable reset — the
kind of defensive "clear this out" line a developer adds without a second
thought — but Tcl refuses it outright: you cannot collapse an array back
into a scalar by assignment. The error only appears at the exact line that
tries to overwrite the array, with no warning anywhere upstream.

This is the sharper version of the pair explored in `docs/HANDOFF.md`: the
original draft demonstrated the same collision by explicitly `unset`ting a
variable first, which reads as contrived stage-managing. Here, the array is
just a normal, plausible config table, and the betrayal is a single
ordinary-looking reassignment.

## Documentation

- [Tcl `array` command](https://www.tcl-lang.org/man/tcl/TclCmd/array.htm) — "array" and scalar variable storage are mutually exclusive for a given name.
- [Tcl `set` command](https://www.tcl-lang.org/man/tcl9.0/TclCmd/set.html)

## Tested version

- Tcl 9.0.4 (`tclsh`, via Homebrew)
- Verified 2026-09-21

## Stage notes

- ~20-25 seconds: show the array, print one element, then the one-liner
  reset that fails. No `unset`, no quoting tricks — just point at line 4.
- Good candidate to replace the doc's original unresolved Tcl entry.
