Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "Dracula"

Hide
Type "export PS1='$ '"
Enter
Type "clear"
Enter
Sleep 300ms
Show

Type "python3"
Enter
Sleep 1500ms
Type "def loud():"
Enter
Type "    try:"
Enter
Type '        raise ValueError("boom")'
Enter
Type "    except Exception as e:"
Enter
Type "        raise"
Enter
Enter
Sleep 500ms
Type "loud()"
Enter
Sleep 2500ms
