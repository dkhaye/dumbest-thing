# Rust — RefCell borrow panic

| Slide | Type | On-screen | Speaker line |
|-------|------|-----------|--------------|
| 1 | Title | "Rust" | Rust — the language that promises memory safety. The borrow checker won't let you have two mutable borrows. |
| 2 | Video | Code typed: `RefCell::new(vec![1, 2, 3])`, `borrow()`, `borrow_mut()` | Here's some code. RefCell — looks fine. We borrow, we print, we borrow mutably. Rust approved it. |
| 3 | Video | `rustc` compiles, then panic: `already borrowed: BorrowMutError` | Wait — that compiled. Let's run it. |
| 4 | Explanation | "compile-time" → ✓ / "runtime" → BorrowMutError | RefCell defers borrow checking to runtime. The compiler approved it. The panic is the surprise. |
