# NOT IN with NULL eliminates expected rows

**Status:** used in the talk — see `sql/final/`.

## Command

```
sqlite3 -header -column ":memory:" < demo.sql
```

## Source

```sql
CREATE TABLE users (id INTEGER, name TEXT);
INSERT INTO users VALUES (1, 'alice'), (2, 'bob'), (3, 'carol'), (4, 'dave');

SELECT * FROM users WHERE id NOT IN (1, 2, NULL);
```

## Observed output

```
label
---------
all rows:
id  name
--  -----
1   alice
2   bob
3   carol
4   dave
label
--------------------
NOT IN (1, 2, NULL):
```

Zero rows are returned for the `NOT IN` query — not even 3 and 4, which are
not 1, 2, or NULL.

## Explanation

`x NOT IN (1, 2, NULL)` expands to `x != 1 AND x != 2 AND x != NULL`. In SQL's
three-valued logic, any comparison against `NULL` evaluates to `UNKNOWN`, not
`TRUE` or `FALSE`. An `AND` chain containing `UNKNOWN` can only produce `TRUE`
if every other operand is `TRUE` and the row still doesn't satisfy the `WHERE`
clause's requirement of "evaluates to `TRUE`" — `UNKNOWN` is treated like
`FALSE` for filtering purposes. So the entire predicate becomes `UNKNOWN` for
every row, and `WHERE` silently drops all of them. This is not a SQLite quirk:
the query was independently run against real PostgreSQL 18.6 (`psql`) with an
identical result — `(0 rows)`. Any list built with `NOT IN` that might contain
a `NULL` (a subquery result, most commonly) can silently return nothing.

## Documentation

- [PostgreSQL: Comparison Functions and Operators (NULL / three-valued logic)](https://www.postgresql.org/docs/current/functions-comparisons.html)

## Tested version

- sqlite3 3.51.0 2025-06-12 (bundled, /usr/bin/sqlite3)
- Cross-checked against PostgreSQL 18.6 (Homebrew) via `psql` — identical `(0 rows)` result
- Verified 2026-09-21

## Stage notes

- ~25-30 seconds: show the table has 4 rows, run the NOT IN query, point at
  the empty result, explain three-valued logic in one sentence.
- Emphasize this is standard SQL, not an SQLite bug — mention the psql
  cross-check verbally if time allows.
