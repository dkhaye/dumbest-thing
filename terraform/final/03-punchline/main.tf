locals {
  names = ["mars", "jupiter"]
}

resource "terraform_data" "server" {
  count = length(local.names)
  input = local.names[count.index]
}
