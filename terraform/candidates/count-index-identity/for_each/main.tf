variable "servers" {
  type = list(string)
}

resource "terraform_data" "server" {
  for_each = toset(var.servers)
  input    = each.value
}
