function configure(opts: { color?: string; width?: number }): void {
  console.log(opts);
}

// The exact same runtime object, but assigned to a variable first.
// The excess property check only runs on fresh object literals passed
// directly to a call. `config`'s inferred type is
// { colour: string; width: number }, and because `color`/`width` are
// optional on the parameter type, that shape is structurally compatible
// -- the misspelled "colour" property is simply ignored.
const config = { colour: "red", width: 100 };
configure(config);
