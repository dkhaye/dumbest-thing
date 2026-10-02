# Rust — RefCell moves borrow checking to runtime, and it panics

**Status:** cut from the talk for time (slowest videos to record, weakest joke of the pool). Chosen over `mem::forget` (see rationale below). Verified and kept as backlog.

## Command

```
cargo run
```

## Source

```rust
use std::cell::RefCell;

fn main() {
    let count = RefCell::new(5);

    let writer = count.borrow_mut();
    println!("writer sees {}", *writer);

    let reader = count.borrow();
    println!("reader sees {}", *reader);
}
```

## Observed output

```
writer sees 5

thread 'main' (PID) panicked at src/main.rs:9:24:
RefCell already mutably borrowed
exit: 101
```

(`(PID)` replaces the real OS thread ID, which varies per run — see Caveats.)

## Explanation

Rust's borrow checker normally enforces "one mutable borrow, or any number
of immutable borrows, never both" *at compile time*, with zero runtime cost.
`RefCell<T>` opts a value out of that: it defers the same rule to runtime,
tracking borrows with an internal counter instead. The code above compiles
cleanly — nothing here looks unsafe or unusual, `writer` isn't even dropped
early since Rust doesn't know we're "done" with it. The moment
`count.borrow()` runs while `writer` (a live mutable borrow) is still in
scope, the process panics. This is "safe" Rust in the sense that it can
never corrupt memory — the price is a runtime crash instead of a compiler
error, in code a reviewer would have no reason to flag.

## Why RefCell over `mem::forget`

The two obvious "safe but philosophically alarming" Rust behaviors were `RefCell` runtime
panics, or `std::mem::forget` silently skipping a value's destructor (a safe resource
leak). Tested both. `mem::forget`'s reveal is an *absence* — the audience
has to notice a `drop` message that never printed, which is a much weaker
visual than an immediate, explicit panic with the literal string "already
mutably borrowed" on screen. RefCell wins on the "surprising on sight" criterion.

## Documentation

- [`std::cell::RefCell`](https://doc.rust-lang.org/core/cell/struct.RefCell.html) — "this technique is called 'dynamic borrowing'... unlike `&T`/`&mut T`, [violations] cause `panic!`"

## Tested version

- rustc 1.98.1 (Homebrew), cargo (bundled)
- Verified 2026-09-21

## Caveats

- The panic message includes the OS thread ID (e.g. `(67793497)`), which
  changes every run. `run.sh` normalizes it to the literal string `(PID)`
  via `sed` so `expected.txt` is stable — this is exactly the kind of
  nondeterminism `README.md`'s repo-wide rules call out; it is normalized,
  never hand-edited to make the diff match.

## Stage notes

- ~25-30 seconds: point out the code compiles and looks ordinary, run it,
  let the panic message land, then name the mechanism in one sentence
  ("runtime borrow checking, and we just failed it").
