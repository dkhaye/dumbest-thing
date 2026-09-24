Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "IR_Black"

Hide
Type "export PS1='$ '"
Enter
Type "source $HOME/.nvm/nvm.sh && nvm use default --silent 2>/dev/null || true"
Enter
Sleep 500ms
Type "clear"
Enter
Sleep 300ms
Show

Type "npx ts-node"
Enter
Sleep 1500ms
Type "type Point = { x: number }"
Enter
Sleep 500ms
Type "function getX(p: Point) { return p.x }"
Enter
Sleep 500ms
Type "getX({ x: 1, y: 2 })"
Enter
Sleep 3s
