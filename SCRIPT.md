# The Dumbest Thing You Can Do in Every Programming Language
### Speaker Script — First Draft

---

## INTRO

**[Slide: Pre-Title]**

Hello, I'm David Haye.  One of the core rules of "Lightning Talks" is that these talks are not supposed to be "Work Related".  So I'm hoping that you'll agree that I'm bending, but not breaking that rule by sharing with you 

**[Slide: Title]**

"The Dumbest Thing You can Do In Every Programming Language"

---

## JAVASCRIPT

**[Slide: JavaScript]**

JavaScript runs in every web browser on earth. It was also, famously, designed in ten days.

**[Video 01 — plays: `["1"].map(parseInt)` → `[ 1 ]`]**

So let's start with a simple data conversion, casting a string to an integer.  Works perfectly. 

**[Video 02 — connector: `["1", "2", "3"].map(parseInt)` typed, cursor waiting]**

Now let's try three.

*[pause — let the audience read the command]*

**[CLICK → Video 03 — punchline: `[ 1, NaN, NaN ]`]**

Well, it still got the first one right.

**[Slide: Explanation]**

Ok, so `map` is passing more than we bargained for.  It passes three things and `parseInt` and `parseInt` takes the first two, leaking index into the radix (or base, as in base-2, base-10)

---

## TYPESCRIPT

**[Slide: TypeScript]**

Next we have JavaScript's big brother, TypeScript.  Typescript is basically JavaScript with a type-checker bolted on.

**[Video 01 — plays: `getX({ x: 1, y: 2 })` → type error]**

So we start by defining a new Type and a Function that uses that Type.  Pass in a bad object and TypeScript throws an error.

**[Video 02 — connector: `getX(p)` typed after `const p = { x: 1, y: 2 }`, cursor waiting]**

But what happens if I assign that exact same value to a variable first.

*[pause]*

**[CLICK → Video 03 — punchline: `1`]**

TypeScript says that it's A-OK now.  Perfect.

**[Slide: Explanation]**

In TypeScript, fresh object literals get strict checking, but variables get "widened"; meaning that TypeScript forgets about the extra property.

Same object. Same data. Different answer depending on how you wrote it.

---

## PHP

**[Slide: PHP]**

PHP powers something like 75% of the web. WordPress runs on PHP.

Whether that's comforting or alarming, I'll leave to you.

**[Video 01 — plays: four assignments with different-looking keys]**

I'm building a PHP array: a group of key and value pairs with four different keys.

**[Video 02 — connector: `print_r($a);` typed, cursor waiting]**

And now what have I stored?

*[pause]*

**[CLICK → Video 03 — punchline: `Array ( [1] => string )`]**

Just one key value pair...

**[Slide: Explanation]**

PHP automatically converts array keys. Booleans, floats and strings all convert to int, so everybody writes to the same place. Last write wins.

---

## SQL

**[Slide: SQL]**

SQL is everybody's favorite declarative language.  You don't tell it how to do it's job, you just tell it what job you want it to do.

**[Video 01 — plays: employees table]**

In this example, we start with a simple employee table.  

**[Video 02 — plays: `NOT IN (1, 2, 3)` → Dave, Eve]**

And say we want to find every employee who is not a manager.  We'll use the known manager ids.

**[Video 03 — connector: subquery version typed, cursor waiting]**

But that isn't scalable, so I'll replace it with a query that fetches the manager IDs from the table itself.

**[CLICK → Video 04 — punchline: zero rows]**

But instead I get nothing.

**[Slide: Explanation]**

In SQL, comparing anything to `NULL` doesn't return false — it returns *unknown.* The WHERE clause can never be true.  Nobody is returned.

---

## TERRAFORM

**[Slide: Terraform]**

Terraform is a DevOps tool; it lets you describe your infrastructure as code.

**[Video 01 — plays: type config + `terraform apply` → Apply complete, 3 added]**

Instead of clicking around in AWS console, you write a file that says: "I want three servers, call them pluto, mars, and jupiter."

**[Video 02 — connector: edit `main.tf` to remove alice, type `terraform plan`, cursor waiting]**

But what if I wanted my servers to be named after "real planets"?

**[CLICK → Video 03 — punchline: plan shows 2 updates + 1 destroy]**

It wants to update two servers and destroy one.

**[Slide: Explanation]**

Terraform uses the *position* as identity, not the name. We cut out Pluto and the other planets crumble.

---

## RUST

**[Slide: Rust]**

Rust is designed for memory safety, checked at compile time.

**[Video 01 - plays: writes the code]**

But what if we use RefCell to write a program where we borrow (or checkout out) the same memory address twice?

**[Video 02 - plays: compiles]**

This compiles fine.  OK. So let's run it.

**[Video 03 - plays: punchline]**

It panics.  Rust lost it's compile time memory safety.

**[Slide: Explanation]**

RefCell is the programmer's way of telling rust 'don't worry about memory safety, I've got this'.  But, clearly, I should have left the checking to the professionals.

---

## PYTHON

**[Slide: Python]**

Python is what everyone learns to code with now. It's everywhere. But every programmer knows that the absolute dumbest thing you can do in Python is:

**[Video 01 — plays: `brew install python3` typed, no Enter]**

OK.  I kid.

**[Video 02 — plays: defines `reraise()`, calls it → exception propagates correctly]**

We start with a `reraise` function that raises an exception.

**[Video 03 — connector: defines `finally_return()` with `finally: return 2`, types `finally_return()`, cursor waiting]**

And then our `finally_return` function also raises an exception.

*[pause]*

**[CLICK → Video 04 — punchline: `2`]**

But the exception is gone.

**[Slide: Explanation]**

`finally` always runs — even with an exception in flight. No warning. No traceback. Your error just doesn't happen.

---

## EPILOGUE

**[Slide: Epilogue — title with EVERY]**

The dumbest thing you can do in 

**[CLICK → SEVEN overlaid on EVERY, red `s` on Language]**

Seven Programming Languages

---

*— Draft generated 2026-09-25 — edit heavily after test run —*
