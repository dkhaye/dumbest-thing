# The Dumbest Thing You Can Do in Every Programming Language
### Speaker Script — First Draft

---

## INTRO

**[Slide: Title]**

Every programming language — without exception — has at least one decision baked into it that will make any experienced developer stop, stare at the screen, and go: *"...that's what it does?"*

This is seven of them.

---

## JAVASCRIPT

**[Slide: JavaScript]**

JavaScript runs in every web browser on earth. It's the reason websites do anything at all. It was also, famously, designed in ten days.

**[Video 01 — plays: `["1"].map(parseInt)` → `[ 1 ]`]**

Here I'm converting an array of strings to numbers. One element — and it gives me `1`. Works perfectly.

**[Video 02 — connector: `["1", "2", "3"].map(parseInt)` typed, cursor waiting]**

Now let's try three.

*[pause — let the audience read the command]*

**[CLICK → Video 03 — punchline: `[ 1, NaN, NaN ]`]**

It got the first one right.

**[Slide: Explanation]**

`map` passes three things to every function: the value, the index, and the array. `parseInt` reads two: the string, and the *base* — as in base-10, base-2.

The array index leaks in as the base. Index zero works. Index one — base-1 doesn't exist. Index two means base-2, and "3" isn't a valid binary number.

One line. Two functions. Zero documentation anywhere that says this.

---

## TYPESCRIPT

**[Slide: TypeScript]**

TypeScript is JavaScript with a type-checker bolted on. Its entire purpose is to catch mistakes before your code runs.

**[Video 01 — plays: `getX({ x: 1, y: 2 })` → type error]**

I'm passing an object with an extra property to a function that doesn't want it. TypeScript catches it. Great. That's the whole pitch.

**[Video 02 — connector: `getX(p)` typed after `const p = { x: 1, y: 2 }`, cursor waiting]**

Same object. Same data. But I assigned it to a variable first.

*[pause]*

**[CLICK → Video 03 — punchline: `1`]**

TypeScript: fine.

**[Slide: Explanation]**

Fresh object literals get strict checking. Variables get "widened" — TypeScript forgets about the extra property.

Same object. Same data. Different answer depending on how you wrote it.

*[Optional layman note: "It's like a bouncer who checks your ID at the door but not once you're already inside."]*

---

## PHP

**[Slide: PHP]**

PHP powers something like 75% of the web. WordPress runs on PHP. Facebook was built in PHP.

Whether that's comforting or alarming, I'll leave to you.

**[Video 01 — plays: four assignments with different-looking keys]**

I'm building an array — a list with labels. Four entries: `true`, `1`, `1.9`, and `"1"`. Four different-looking keys.

**[Video 02 — connector: `print_r($a);` typed, cursor waiting]**

How many slots does my array have?

*[pause]*

**[CLICK → Video 03 — punchline: `Array ( [1] => string )`]**

One.

**[Slide: Explanation]**

PHP array keys can only be integers or strings. `true` becomes `1`. The float `1.9` becomes `1`. The string `"1"` becomes `1`.

Every write went to the same slot. Last write wins. The string wins.

---

## SQL

**[Slide: SQL]**

SQL has been around since the 1970s. It's how almost every application on earth talks to its database.

**[Video 01 — plays: employees table, `NOT IN (1, 2, 3)` → Dave, Eve]**

Standard `NOT IN` query with a hardcoded list — gives me the employees not on that list. Works fine.

**[Video 02 — connector: subquery version typed, cursor waiting]**

Now I want to find everyone who isn't a manager. So instead of a hardcoded list, I replace it with a query that fetches the manager IDs from the table itself.

*[pause — "I'm asking SQL to figure out the list."]*

**[CLICK → Video 03 — punchline: zero rows]**

Zero rows. Alice is not a manager. She should absolutely be on this list.

**[Slide: Explanation]**

One employee — Alice — has no manager because she *is* the top-level manager. Her manager ID is `NULL`.

`NOT IN` expands to: *id ≠ 1 AND id ≠ 2 AND id ≠ NULL.* In SQL, comparing anything to `NULL` doesn't return false — it returns *unknown.* The WHERE clause can never be true. Nobody comes home.

*[Optional layman note: "NULL doesn't mean zero or empty, it means 'we don't know.' And 'I don't know' is not the same as 'no'."]*

---

## TERRAFORM

**[Slide: Terraform]**

Terraform is a DevOps tool — it lets you describe your infrastructure as code. Instead of clicking around in a web console, you write a file that says: "I want three servers, call them alice, bob, and charlie."

**[Video 01 — plays: type config + `terraform apply` → Apply complete, 3 added]**

Three servers. Alice at position zero, bob at one, charlie at two. Applied. Done.

**[Video 02 — connector: edit `main.tf` to remove alice, type `terraform plan`, cursor waiting]**

I renamed the list — removed alice, now just bob and charlie. Let me ask Terraform what it would do.

*[pause]*

**[CLICK → Video 03 — punchline: plan shows 2 updates + 1 destroy]**

It wants to update two servers and destroy one.

**[Slide: Explanation]**

Terraform uses the *position* as identity, not the name. Remove position zero — alice — and position one slides down. Terraform sees a new name at position zero: that's an update. Same for one. Position two no longer exists: that's a destroy.

Rename your list; Terraform rebuilds your infrastructure.

*[Optional layman note: "It's like naming your kids First Child, Second Child, Third Child — instead of names. Add an older sibling and everyone gets renamed."]*

---

## RUBY

**[Slide: Ruby]**

Ruby's design goal — written in its official documentation — is *programmer happiness.* It is an extremely expressive, extremely flexible language.

**[Video 01 — plays: type heredoc with `class Integer` / redefine `+` / `puts 1 + 1`]**

In Ruby, you can open any class — including the built-in ones — and change how they work.

Here I'm opening `Integer` — the class every number belongs to — and redefining what `+` does. It now always returns 42. For every integer. In the entire program.

**[Video 02 — connector: `ruby /tmp/demo.rb` typed, cursor waiting]**

`puts 1 + 1`.

*[pause — let that sit]*

**[CLICK → Video 03 — punchline: `42`]**

.

**[Slide: Explanation]**

No warnings. No errors.

Ships to production.

*"Programmer happiness."*

---

## PYTHON

**[Slide: Python]**

Python is what everyone learns to code with now. It's in data science, machine learning, automation — it's everywhere.

**[Video 01 — plays: `brew install python3` typed, no Enter]**

There are, uh. *A few* ways to install Python on a Mac.

*[beat]*

Anyway.

**[Video 02 — plays: defines `loud()`, calls it → exception propagates correctly]**

The `loud` function raises an exception. It propagates up correctly. That's exactly how exceptions are supposed to work.

**[Video 03 — connector: defines `silent()` with `finally: return 2`, types `silent()`, cursor waiting]**

`silent` also raises an exception — but it has a `finally` block that returns early.

*[pause]*

**[CLICK → Video 04 — punchline: `2`]**

The exception is gone.

**[Slide: Explanation]**

`finally` always runs — even with an exception in flight. `return` inside `finally` discards the pending exception on its way out.

No warning. No traceback. Your error just doesn't happen.

*[Optional layman note: "It's like a cleanup crew that accidentally throws out the incident report."]*

---

## EPILOGUE

**[Slide: Epilogue — title with EVERY]**

The dumbest thing you can do in *every* programming language.

**[CLICK → SEVEN overlaid on EVERY, red `s` on Language]**

Seven.

Thank you.

---

*— Draft generated 2026-09-25 — edit heavily after test run —*
