CREATE TABLE users (id INTEGER, name TEXT);
INSERT INTO users VALUES (1, 'alice'), (2, 'bob'), (3, 'carol'), (4, 'dave');

SELECT 'all rows:' AS label;
SELECT * FROM users;

SELECT 'NOT IN (1, 2, NULL):' AS label;
SELECT * FROM users WHERE id NOT IN (1, 2, NULL);
