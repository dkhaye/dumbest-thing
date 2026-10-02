# excess property check disappears through a variable

**Status:** used in the talk — see `typescript/final/`.

## Command

```
bash run.sh
```

(Runs `tsc --noEmit --strict` against `error.ts`, then against `pass.ts`,
from the `typescript/` folder so `npx --no-install tsc` resolves the local
`node_modules/typescript`.)

## Source

`error.ts` — fresh object literal, straight to the call site:

```ts
function configure(opts: { color?: string; width?: number }): void {
  console.log(opts);
}

configure({ colour: "red", width: 100 });
```

`pass.ts` — the same runtime object, assigned to a variable first:

```ts
function configure(opts: { color?: string; width?: number }): void {
  console.log(opts);
}

const config = { colour: "red", width: 100 };
configure(config);
```

## Observed output

```
=== error.ts ===
candidates/excess-property-check/error.ts(9,13): error TS2561: Object literal may only specify known properties, but 'colour' does not exist in type '{ color?: string | undefined; width?: number | undefined; }'. Did you mean to write 'color'?
exit: 2
=== pass.ts ===
exit: 0
```

## Explanation

`configure`'s parameter type has an optional `color` property, so
structurally there's nothing wrong with an object that merely lacks it.
But `error.ts` passes a **fresh object literal** directly into the call,
and TypeScript layers an extra, literal-only check on top of ordinary
structural typing: excess property checking. Because the literal has a
`colour` (British spelling) that the parameter type doesn't recognize,
`tsc` flags it as an unknown property — a typo-catching convenience, not
a soundness requirement.

`pass.ts` builds the exact same object but assigns it to `config` first.
The excess property check only fires on object literals written directly
at a call site; once the value passes through a variable, TypeScript
falls back to plain structural compatibility. `config`'s inferred type
`{ colour: string; width: number }` is compatible with
`{ color?: string; width?: number }` — an object with extra properties
still satisfies a type that only requires a subset of them — so the
misspelled property is silently ignored and the call passes.

Same object, same shape, same misspelling. Whether TypeScript catches it
depends entirely on whether a variable sits between the literal and the
call.

## Documentation

- [TypeScript Handbook: Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Handbook: Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)

## Tested version

- TypeScript 5.9.3 (installed via `npm install` in `typescript/`, resolved through `npx --no-install`)
- node v22.13.1 (via nvm, default alias)
- Verified 2026-09-21

## Stage notes

- ~25-30 seconds: run `error.ts`, point at the excess-property error; run
  `pass.ts` on the "same" object, point at the silent pass.
- Compiler before/after, not a REPL — TypeScript is strongest shown this way.
- Punchline: "I didn't fix the typo. I just gave it a name first."
