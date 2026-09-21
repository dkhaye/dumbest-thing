# map + parseInt

**Status:** leading candidate, likely final slot

## Command

```
node demo.js
```

## Source

```js
console.log(["1", "2", "3"].map(parseInt));
```

## Observed output

```
[ 1, NaN, NaN ]
```

## Explanation

`Array.prototype.map` calls its callback with three arguments:
`(element, index, array)`. `parseInt` accepts two: `(string, radix)`. So
`map` unintentionally passes the array index as the radix.

- `parseInt("1", 0)` → radix `0` means "auto-detect," `1` in base 10 → `1`
- `parseInt("2", 1)` → radix `1` is invalid (must be 0 or 2-36) → `NaN`
- `parseInt("3", 2)` → `"3"` is not a valid digit in base 2 → `NaN`

The code looks completely idiomatic — passing a well-known global function
directly as a callback is a common pattern. The betrayal is that `map`'s
calling convention silently repurposes the second argument.

## Documentation

- [MDN: Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [MDN: parseInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

## Tested version

- node v22.13.1 (via nvm, default alias)
- Verified 2026-09-21

## Stage notes

- ~20-25 seconds: show the one-liner, run it, point at index-as-radix.
- No setup needed beyond a plain `node` REPL or file.
