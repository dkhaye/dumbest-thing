Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "IR_Black"

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
Type "def reraise():"
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
Type "reraise()"
Enter
Sleep 800ms
Show

Enter
Sleep 500ms
Type "def finally_return():"
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
Type "finally_return()"
Sleep 2500ms
