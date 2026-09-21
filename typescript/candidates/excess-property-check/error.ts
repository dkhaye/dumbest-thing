function configure(opts: { color?: string; width?: number }): void {
  console.log(opts);
}

// Fresh object literal, straight to the call site.
// TypeScript runs the excess property check against literals: "colour"
// (British spelling) isn't "color" on the parameter type, so it's flagged
// as an unknown property -- even though both properties are optional.
configure({ colour: "red", width: 100 });
