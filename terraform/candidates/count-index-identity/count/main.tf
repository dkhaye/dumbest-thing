variable "servers" {
  type = list(string)
}

resource "terraform_data" "server" {
  count = length(var.servers)
  input = var.servers[count.index]
}
