Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "IR_Black"

Hide
Type "export PS1='$ '"
Enter
Type "export PATH=$HOME/.rbenv/versions/3.1.2/bin:$PATH"
Enter
Sleep 200ms
Type "clear"
Enter
Sleep 300ms
Show

Type "cat > /tmp/demo.rb << 'RUBY'"
Enter
Sleep 200ms
Type "class Integer"
Enter
Type "  def +(other)"
Enter
Type "    42"
Enter
Type "  end"
Enter
Type "end"
Enter
Type "puts 1 + 1"
Enter
Type "RUBY"
Enter
Sleep 2s
