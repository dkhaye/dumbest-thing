# Terraform — removing the first item in a `count` list rewrites everyone after it

**Status:** leading candidate — resolves the doc's open Terraform question,
beats both drafts (`for_each` key rename, map-to-object lossy conversion)

## Command

```
bash run.sh
```

Runs the same one-line list edit against two variants of an identical
resource block — one using `count`, one using `for_each` — and shows
`terraform plan` for each. `terraform_data` is a core resource (ships with
Terraform itself, no provider download, no network, no real
infrastructure) used purely to observe resource identity.

## Source

`count/main.tf`:

```hcl
variable "servers" {
  type = list(string)
}

resource "terraform_data" "server" {
  count = length(var.servers)
  input = var.servers[count.index]
}
```

`for_each/main.tf` — same idea, keyed by value instead of position:

```hcl
variable "servers" {
  type = list(string)
}

resource "terraform_data" "server" {
  for_each = toset(var.servers)
  input    = each.value
}
```

Both start from `servers = ["alpha", "beta", "gamma"]`, then remove
`"alpha"` from the front of the list and re-plan.

## Observed output

```
=== count ===

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  ~ update in-place
  - destroy

Terraform will perform the following actions:

  # terraform_data.server[0] will be updated in-place
  ~ resource "terraform_data" "server" {
        id     = "<redacted>"
      ~ input  = "alpha" -> "beta"
      ~ output = "alpha" -> (known after apply)
    }

  # terraform_data.server[1] will be updated in-place
  ~ resource "terraform_data" "server" {
        id     = "<redacted>"
      ~ input  = "beta" -> "gamma"
      ~ output = "beta" -> (known after apply)
    }

  # terraform_data.server[2] will be destroyed
  # (because index [2] is out of range for count)
  - resource "terraform_data" "server" {
      - id     = "<redacted>" -> null
      - input  = "gamma" -> null
      - output = "gamma" -> null
    }

Plan: 0 to add, 2 to change, 1 to destroy.

─────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run "terraform apply" now.

=== for_each ===

Terraform used the selected providers to generate the following execution
plan. Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  # terraform_data.server["alpha"] will be destroyed
  # (because key ["alpha"] is not in for_each map)
  - resource "terraform_data" "server" {
      - id     = "<redacted>" -> null
      - input  = "alpha" -> null
      - output = "alpha" -> null
    }

Plan: 0 to add, 0 to change, 1 to destroy.

─────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run "terraform apply" now.
```

(`<redacted>`: the resource ids are random UUIDs generated fresh on every
run; `run.sh` normalizes them so the recorded output stays diffable.)

## Explanation

With `count`, a resource's identity in state is its **position** in the
list — `terraform_data.server[0]`, `[1]`, `[2]`. Deleting `"alpha"` from
the front of `servers` doesn't just remove one resource: every element
after it shifts down an index, so Terraform reads that as `[0]`'s *value*
changing from `alpha` to `beta`, `[1]`'s value changing from `beta` to
`gamma`, and `[2]` simply falling off the end and getting destroyed. The
config diff is one line; the plan is three resource actions, on the two
resources that were never touched. On a real resource (not `terraform_data`)
some of those "updates" would instead be forced replacements, since the
input often can't be changed in place — meaning `beta` and `gamma` get
destroyed and recreated too, not just relabeled.

With `for_each`, a resource's identity is the **value itself** — a set
key, a map key. `terraform_data.server["alpha"]`, `["beta"]`,
`["gamma"]`. Removing `"alpha"` destroys exactly `terraform_data.server["alpha"]`.
Nothing else in the plan changes, because nothing else's identity depends
on where `"alpha"` used to sit in the list.

This is the exact, well-documented reason `for_each` exists (HashiCorp's
own CDKTF docs cite index-driven destroy/recreate as the reason CDKTF
converts lists to sets before iterating). It clears the bar the doc's two
Terraform drafts didn't: it's a two-line diff that looks like a harmless
list edit, it's not a contrived stunt (this is exactly what a "remove one
server from the list" PR looks like in real Terraform code), and the
before/after (`count` vs `for_each`) gives a built-in visual contrast.

## Documentation

- [Terraform `count`](https://developer.hashicorp.com/terraform/language/meta-arguments/count) — resource instances are addressed by list index.
- [Terraform `for_each`](https://developer.hashicorp.com/terraform/language/meta-arguments/for_each) — resource instances are addressed by map/set key.
- [CDKTF iterators](https://developer.hashicorp.com/terraform/cdktf/concepts/iterators) — explicitly states CDKTF converts lists to sets for iteration "to prevent accidental resource deletion and recreation due to index changes."

## Tested version

- Terraform v1.16.1 (Homebrew, darwin/arm64)
- Verified 2026-09-22

## Stage notes

- ~30-35 seconds: show both `main.tf` files side by side (or in quick
  succession) with the same starting list, then the one-line list edit,
  then both plans. Land on "count destroyed nothing you asked it to
  destroy, and touched two resources you didn't ask it to touch."
- Slightly longer than the fastest gags (JS map/parseInt, Ruby monkey
  patch) because it needs the count-vs-for_each contrast to land, but
  shorter than the doc's two rejected Terraform drafts, which both needed
  more setup to explain.
- Uses `terraform_data` (a core resource, no provider download, no cloud
  credentials, no network) purely to have something with an id to observe
  — this is not about any specific cloud resource type, it's about how
  Terraform assigns identity.
