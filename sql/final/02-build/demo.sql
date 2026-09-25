CREATE TABLE employees (id INTEGER, name TEXT, manager_id INTEGER);
INSERT INTO employees VALUES
  (1, 'Alice', NULL),
  (2, 'Bob',   1),
  (3, 'Carol', 1),
  (4, 'Dave',  2),
  (5, 'Eve',   3);
