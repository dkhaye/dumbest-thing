# SQL — NOT IN NULL

| Slide | Type | On-screen | Speaker line |
|-------|------|-----------|--------------|
| 1 | Title | "SQL" | Now to everyone's favorite declarative language, SQL |
| 2 | Video | employees table + `NOT IN (1, 2, 3)` → Dave, Eve | Sometimes you want to know when something is not included |
| 3 | Video | `NOT IN (SELECT manager_id FROM employees)` → (nothing) | But what about finding all of the ICs? |
| 4 | Explanation | NULL / NOT IN mechanic | [script polish pass] |
