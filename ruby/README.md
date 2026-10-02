# Ruby

Ruby candidates for [The Dumbest Thing You Can Do in Every Programming Language](../README.md).
None of them made the talk; they are verified reproducers kept as a backlog.

The candidate's `run.sh` prefers rbenv's Ruby 3.1.2 (`~/.rbenv/versions/3.1.2/bin/ruby`)
if present, and otherwise falls back to whatever `ruby` is on `PATH`. The system
Ruby that rbenv shims can resolve to (2.6.10) is too old.
