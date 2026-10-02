# Contributing

This is a finished project: the companion repo for a lightning talk, published
so people can read and run the demos. **No contributions are expected**, and
pull requests and issues may go unanswered. You're welcome to fork it and do
whatever you like, under the terms of the [Apache 2.0 license](LICENSE).

## Running it locally

```sh
git clone https://github.com/dkhaye/dumbest-thing.git
cd dumbest-thing
make doctor   # see which language toolchains you have installed
make verify   # run every demo and diff its output against expected.txt
```

You only need the toolchains for the languages you want to run (`node`,
`python3`, `go`, `cargo`, `tclsh`, `ruby`, `php`, `sqlite3`, `terraform`).
A single demo is just `bash run.sh` in its directory. See the
[README](README.md) for details, including how the talk's recordings and
slide deck are built.

## If you do send a change

- Every demo must be reproducible offline from checked-in source, with a
  `run.sh` and an `expected.txt`. `make verify` must pass.
- Never hand-edit a demo's output to make it more surprising.
- Record the tool version a demo was verified against.
- Run `shellcheck` on any shell script you touch.

Participation is covered by the [Code of Conduct](CODE_OF_CONDUCT.md).
