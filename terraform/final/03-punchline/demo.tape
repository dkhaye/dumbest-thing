Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "Dracula"

Hide
Type "export PS1='$ '"
Enter
Type "rm -rf /tmp/tf-demo-03 && bash setup-state.sh /tmp/tf-demo-03"
Enter
Sleep 5s
Type "cp main.tf /tmp/tf-demo-03/main.tf && cd /tmp/tf-demo-03"
Enter
Sleep 300ms
Type "clear"
Enter
Sleep 300ms
Show

Type "cat main.tf"
Enter
Sleep 1500ms
Type "terraform plan -input=false -no-color"
Enter
Sleep 5s
