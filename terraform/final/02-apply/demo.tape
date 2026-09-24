Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "IR_Black"

Hide
Type "export PS1='$ '"
Enter
Type "rm -rf /tmp/tf-demo-02 && mkdir -p /tmp/tf-demo-02 && cp main.tf /tmp/tf-demo-02/"
Enter
Sleep 200ms
Type "cd /tmp/tf-demo-02 && terraform init -input=false > /dev/null 2>&1"
Enter
Sleep 3s
Type "clear"
Enter
Sleep 300ms
Show

Type "terraform apply -auto-approve -input=false"
Enter
Sleep 8s
Type "terraform plan -input=false -no-color"
Enter
Sleep 4s
