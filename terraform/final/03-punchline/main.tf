locals {
  names = ["bob", "charlie"]
}

resource "terraform_data" "server" {
  count = length(local.names)
  input = local.names[count.index]
}
