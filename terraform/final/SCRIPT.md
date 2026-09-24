# Terraform — count-index identity shift

| Slide | Type | On-screen | Speaker line |
|-------|------|-----------|--------------|
| 1 | Title | "Terraform" | Now to Terraform — infrastructure-as-code |
| 2 | Video | `main.tf` with `count` over `["alice", "bob", "charlie"]` | Three resources, defined with count. Looks clean. |
| 3 | Video | `terraform apply` → 3 created, `terraform plan` → No changes | Apply it. Clean state. Zero changes. Everything looks fine. |
| 4 | Video | `cat main.tf` → `["bob", "charlie"]`, `terraform plan` → 2 updates + 1 destroy | Remove alice. One edit. Expect one destroy. Instead... |
| 5 | Explanation | count index = identity, index shift = cascade | [explain the actual mechanism] |
