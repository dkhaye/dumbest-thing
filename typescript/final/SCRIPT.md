# TypeScript — excess property check

| Slide | Type | On-screen | Speaker line |
|-------|------|-----------|--------------|
| 1 | Title | "TypeScript" | TypeScript — the language that promises to keep you safe |
| 2 | Video | `getX({ x: 1, y: 2 })` → error TS2353 | Fresh object literal, extra property — TypeScript catches it. Good. |
| 3 | Video | `const p = { x: 1, y: 2 }; getX(p)` → `1` | Same object, same data, stored in a variable first — no error. Returns 1. |
| 4 | Explanation | excess-property check fires on literals only | [explain the actual mechanism] |
