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
Type "cat > /tmp/npreview.js << 'JS'"
Enter
Type "require('repl').start({preview:false});"
Enter
Type "JS"
Enter
Sleep 200ms
Type "export NODE_REPL_EXTERNAL_MODULE=/tmp/npreview.js"
Enter
Sleep 200ms
Type "clear"
Enter
Sleep 300ms
Type "node"
Enter
Sleep 1500ms
Type '["1"].map(parseInt)'
Enter
Sleep 800ms
Show

Enter
Sleep 500ms
Type '["1", "2", "3"].map(parseInt)'
Sleep 2500ms
