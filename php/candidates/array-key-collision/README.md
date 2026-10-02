# array key collision

**Status:** used in the talk — see `php/final/`.

## Command

```
php demo.php
```

## Source

```php
$a[true] = "boolean";
$a[1]    = "integer";
$a[1.9]  = "float";
$a["1"]  = "string";

print_r($a);
```

## Observed output

```
Array
(
    [1] => string
)
```

## Explanation

PHP array keys are only ever integers or strings. Any other scalar key is
cast to one of those two types before the assignment happens, so four
visually distinct writes all land on the exact same slot:

- `true` casts to the integer `1`
- `1` is already the integer `1`
- `1.9` (a float) casts to the integer `1` — truncated, not rounded
- `"1"` is a numeric string that casts to the integer `1`

There is only ever one key, `1`, and each assignment overwrites the
previous value. Since the writes happen in order, the last one — `$a["1"]
= "string"` — wins, leaving a single entry: `[1] => string`. The code
looks like four separate keys because it reads like four separate keys;
PHP's key-casting rules quietly collapse them into one.

## Documentation

- [PHP Manual: Arrays](https://www.php.net/manual/en/language.types.array.php) —
  see the "Type of key" section: "Strings containing valid decimal integers,
  unless the number is preceded by a + sign, will be cast to the int type.
  ... Floats are also cast to int, which means that the fractional part
  will be truncated. ... Bools are cast to int too, i.e. the key true will
  actually be stored under 1 and the key false under 0."

## Tested version

- PHP 8.3.33 (cli) (NTS)
- Verified 2026-09-21

## Stage notes

- ~20-25 seconds: write the four lines, run it, point at the single entry.
- Land the punchline on "four keys, one slot" before explaining the cast
  rules — the surprise should hit before the mechanism.
