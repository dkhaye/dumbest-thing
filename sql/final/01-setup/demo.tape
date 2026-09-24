Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "IR_Black"

Hide
Type "export PS1='$ '"
Enter
Type "rm -f /tmp/demo-sql.db && sqlite3 /tmp/demo-sql.db < demo.sql"
Enter
Sleep 500ms
Type "printf '.headers on\n.mode column\n.nullvalue NULL\n' > /tmp/sqlite-demo.rc"
Enter
Type "alias sqlite3='sqlite3 -init /tmp/sqlite-demo.rc'"
Enter
Sleep 200ms
Type "clear"
Enter
Sleep 300ms
Show

Type "sqlite3 /tmp/demo-sql.db"
Enter
Sleep 1000ms
Type "SELECT * FROM employees;"
Enter
Sleep 1500ms
Type "SELECT name FROM employees WHERE id NOT IN (1, 2, 3);"
Enter
Sleep 2500ms
