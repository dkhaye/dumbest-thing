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

JavaScript runs in every web browser on earth. It's the reason websites do anything at all. It was also, famously, designed in ten days.

**[Video 01 — plays: `["1"].map(parseInt)` → `[ 1 ]`]**

So let's start with a simple data conversion.  We start with a string containing the 1 character and we cast it to the number 1.  Works perfectly. 

**[Video 02 — connector: `["1", "2", "3"].map(parseInt)` typed, cursor waiting]**

Now let's try three.

*[pause — let the audience read the command]*

**[CLICK → Video 03 — punchline: `[ 1, NaN, NaN ]`]**

Well, it still got the first one right.

**[Slide: Explanation]**

Ok, so `map` is passing more into `parseInt` than we bargained for.  It passes three things to every function: the value, the index, and the array. `parseInt` reads two: the string, and the radix or *base* — as in base-10, base-2.

The array index leaks in as the base. Index zero works. Index one — base-1 doesn't exist. Index two means base-2, and "3" isn't a valid binary number.

---

## TYPESCRIPT

**[Slide: TypeScript]**

Next we have JavaScript's big brother, TypeScript.  Typescript is basically JavaScript with a type-checker bolted on. Its entire purpose is to catch mistakes before your code runs.

**[Video 01 — plays: `getX({ x: 1, y: 2 })` → type error]**

So we start by defining a new Type and a Function that uses that Type.  And as expected, when I pass in an object with an extra property to it,  TypeScript catches it. Great. That's the whole pitch.

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

I'm building a PHP array: a group of key and value pairs. I have four entries: `true`, `1`, `1.9`, and `"1"`. Four different keys.

**[Video 02 — connector: `print_r($a);` typed, cursor waiting]**

So, I've stored all four values, let's take a look at what I've got.

*[pause]*

**[CLICK → Video 03 — punchline: `Array ( [1] => string )`]**

One.

**[Slide: Explanation]**

PHP automatically converts array keys. Booleans become integers — true is 1. Floats truncate — 1.9 becomes 1, not 2. Strings that look like numbers become those numbers — "1" becomes 1. All four writes landed on the same key. Last write wins.

---

## SQL

**[Slide: SQL]**

SQL is everybody's favorite declarative language.  You don't tell it how to do it's job, you just tell it what job you want it to do.

**[Video 01 — plays: employees table]**

In this example, we start with a simple employee table with an id, a name, and the id of their manager.  

**[Video 02 — plays: `NOT IN (1, 2, 3)` → Dave, Eve]**

And say we want to find every employee who is not a manager.  A quick glance at the manager_id column says the managers are ids 1, 2 and 3 and Dave and Eve are the ICs.  It checks out.

**[Video 02 — connector: subquery version typed, cursor waiting]**

Now what happens when we add new managers?  We have to keep our list of manager ids updated manually.  So instead of a hardcoded list, I'll replace it with a query that fetches the manager IDs from the table itself, and I should get the same answer.

**[CLICK → Video 03 — punchline: zero rows]**

But I don't.

**[Slide: Explanation]**

One employee, Alice, has no manager because she *is* the CEO. Her manager ID is `NULL`.

And `NOT IN` expands to: *id ≠ 1 AND id ≠ 2 AND id ≠ NULL.* In SQL, comparing anything to `NULL` doesn't return false — it returns *unknown.* The WHERE clause can never be true.  Nobody is returned.

---

## TERRAFORM

**[Slide: Terraform]**

Terraform is a DevOps tool; it lets you describe your infrastructure as code. Instead of clicking around in AWS console, you write a file that says: 

**[Video 01 — plays: type config + `terraform apply` → Apply complete, 3 added]**

"I want three servers, call them pluto, mars, and jupiter."  Then you apply and boom, three servers created, each with a unique id.

**[Video 02 — connector: edit `main.tf` to remove alice, type `terraform plan`, cursor waiting]**

But on second thought, I only wanted my servers named after "real planets", so let's try again with just "mars and jupiter" and we'll see how `terraform` handles this.

*[pause]*

**[CLICK → Video 03 — punchline: plan shows 2 updates + 1 destroy]**

It wants to update two servers and destroy one.

**[Slide: Explanation]**

Terraform uses the *position* as identity, not the name. Remove position zero — pluto — and position one slides down. Terraform sees a new name at position zero: that's an update. Same for one. Position two no longer exists: that's a destroy.

Rename your list; Terraform rebuilds your infrastructure.

---

## PYTHON

**[Slide: Python]**

Python is what everyone learns to code with now. It's in data science, machine learning, automation — it's everywhere.  But every programmer knows that the absolute dumbest thing you can do in Python is:

**[Video 01 — plays: `brew install python3` typed, no Enter]**

OK.  I kid.  I don't love python, but I know a lot of programmers do.

**[Video 02 — plays: defines `reraise()`, calls it → exception propagates correctly]**

So in `python`, we're going to look at exception handling.  Our `reraise` function raises an exception. It propagates up correctly. That's exactly how exceptions are supposed to work.

**[Video 03 — connector: defines `finallyReturn()` with `finally: return 2`, types `finallyReturn()`, cursor waiting]**

`finallyReturn` also raises an exception.

*[pause]*

**[CLICK → Video 04 — punchline: `2`]**

But the exception is gone.

**[Slide: Explanation]**

`finally` always runs — even with an exception in flight. `return` inside `finally` discards the pending exception on its way out.

No warning. No traceback. Your error just doesn't happen.

---

## EPILOGUE

**[Slide: Epilogue — title with EVERY]**

The dumbest thing you can do in 

**[CLICK → SEVEN overlaid on EVERY, red `s` on Language]**

Seven Programming Languages

---

*— Draft generated 2026-09-25 — edit heavily after test run —*
