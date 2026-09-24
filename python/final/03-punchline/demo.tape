Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "Dracula"

Hide
Type "export PS1='$ '"
Enter
Type "export PYTHON_BASIC_REPL=1"
Enter
Type "export PYTHONWARNINGS=ignore::SyntaxWarning"
Enter
Type "clear"
Enter
Sleep 300ms
Type "brew install python3"
Sleep 300ms
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
Backspace
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
Sleep 800ms
Show

Type "def silent():"
Enter
Type "    try:"
Enter
Type '        raise ValueError("boom")'
Enter
Type "    finally:"
Enter
Type "        return 2"
Enter
Enter
Sleep 500ms
Type "silent()"
Enter
Sleep 2500ms
