# typed nil interface is not nil

**Status:** not used — strong candidate, deferred as speed-round material. Verified and kept as backlog.

## Command

```
go run demo.go
```

## Source

```go
package main

import "fmt"

type MyError struct{}

func (e *MyError) Error() string { return "boom" }

func main() {
	var p *MyError = nil
	var err error = p
	fmt.Println(err == nil) // false: interface holds a (type, value) pair

	var plain error = nil
	fmt.Println(plain == nil) // true: no dynamic type at all
}
```

## Observed output

```
false
true
```

## Explanation

An interface value in Go is a pair: a dynamic type and a dynamic value. When
`p` (a `*MyError` with a nil value) is assigned to the `error` interface
variable `err`, the interface now holds the pair `(*MyError, nil)`. That pair
is not equal to the "true" nil interface, which is the pair `(nil, nil)` —
no type at all. So `err == nil` is `false`, even though the pointer inside it
is nil.

The second line assigns a literal untyped `nil` directly to an `error`
variable, so it has no dynamic type — that one compares equal to `nil`, as
expected. Placing the two side by side is what makes the betrayal legible:
identical-looking "nil" values, opposite comparison results, depending only
on whether a concrete type was involved along the way.

The classic failure mode this causes in real code: a function returns a
named `*MyError` (nil on success) as its `error` return type, and a caller's
`if err != nil` check is true even though nothing went wrong.

## Documentation

- [Go spec: Comparison operators](https://go.dev/ref/spec#Comparison_operators) — interface values are equal only if they have identical dynamic types and equal dynamic values, or are both nil.
- [Go spec: Interface types](https://go.dev/ref/spec#Interface_types)

## Tested version

- go version go1.27.1 darwin/arm64
- Verified 2026-09-21

## Stage notes

- ~25-30 seconds: assign nil pointer to interface, print `false`, then
  contrast with a literal nil interface printing `true`. Explanation: "the
  interface remembers the type even when the value is nil."
- No setup needed beyond `go run demo.go`.
