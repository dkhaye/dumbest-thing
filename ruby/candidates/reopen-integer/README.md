# reopen Integer and replace addition

**Status:** leading candidate — fast palate cleanser, not central beat

## Command

```
ruby demo.rb
```

## Source

```ruby
class Integer
  def +(other)
    42
  end
end

puts 1 + 1
```

## Observed output

```
42
```

## Explanation

Ruby classes are open: any class, including a core class like `Integer`,
can be reopened at any time and have its methods redefined. Here, `+` on
`Integer` is replaced outright, so every subsequent integer addition in the
process returns `42` regardless of operands. The code is syntactically
ordinary — a `class` block redefining a method — and Ruby accepts it without
any special ceremony.

Per the production handoff: this one is somewhat deliberate rather than
accidental. It doesn't need much setup or a subtle mechanism to explain, so
it works best as a fast palate cleanser between deeper examples rather than
the intellectual center of the talk.

## Documentation

- [Ruby: Modules and Classes](https://ruby-doc.org/3.3/syntax/modules_and_classes_rdoc.html)

## Tested version

- ruby 3.1.2p20 (2022-04-12 revision 4491bb740a) [arm64-darwin21] (via rbenv, pinned — NOT the system ruby 2.6.10 shim default)
- Verified 2026-09-21

## Stage notes

- ~15-20 seconds: reopen `Integer`, redefine `+`, run `1 + 1`, point at `42`.
- Fastest candidate to explain; good as a quick beat rather than a deep dive.
