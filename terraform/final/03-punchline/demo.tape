Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "IR_Black"

Hide
Type "export PS1='$ '"
Enter
Type "rm -rf /tmp/tf-demo && mkdir -p /tmp/tf-demo && cd /tmp/tf-demo"
Enter
Sleep 200ms
Type "clear"
Enter
Sleep 300ms
Type "cat > main.tf << 'HCL'"
Enter
Sleep 200ms
Type "locals {"
Enter
Type '  names = ["alice", "bob", "charlie"]'
Enter
Type "}"
Enter
Enter
Type 'resource "terraform_data" "server" {'
Enter
Type "  count = length(local.names)"
Enter
Type "  input = local.names[count.index]"
Enter
Type "}"
Enter
Type "HCL"
Enter
Sleep 300ms
Type "terraform init -input=false > /dev/null 2>&1"
Enter
Sleep 4s
Type "clear"
Enter
Sleep 300ms
Type "terraform apply -auto-approve -input=false > /dev/null 2>&1"
Enter
Sleep 10s
Type "clear"
Enter
Sleep 300ms
Type "terraform state list"
Enter
Sleep 1s
Show

Type "cat > main.tf << 'HCL'"
Enter
Sleep 200ms
Type "locals {"
Enter
Type '  names = ["bob", "charlie"]'
Enter
Type "}"
Enter
Enter
Type 'resource "terraform_data" "server" {'
Enter
Type "  count = length(local.names)"
Enter
Type "  input = local.names[count.index]"
Enter
Type "}"
Enter
Type "HCL"
Enter
Sleep 800ms
Type "terraform plan -input=false -no-color"
Enter
Sleep 5s
