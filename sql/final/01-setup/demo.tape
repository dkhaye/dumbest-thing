Output demo.mp4
Set FontSize 22
Set Width 1280
Set Height 720
Set Theme "Dracula"

Hide
Type "rm -f /tmp/demo-sql.db && sqlite3 /tmp/demo-sql.db < demo.sql"
Enter
Sleep 500ms
Type "sqlite3 /tmp/demo-sql.db"
Enter
Sleep 800ms
Type ".headers on"
Enter
Type ".mode column"
Enter
Type ".nullvalue NULL"
Enter
Sleep 200ms
Type ".shell clear"
Enter
Sleep 300ms
Show

Type "SELECT * FROM employees;"
Enter
Sleep 1500ms
Type "SELECT name FROM employees WHERE id NOT IN (1, 2, 3);"
Enter
Sleep 2500ms
