BEGIN;

TRUNCATE
  users_messages,
  users,
  messages
  RESTART IDENTITY CASCADE;

INSERT INTO messages
  (id, text)
VALUES
  ('ac565e23-273d-4d07-adc7-769863ec7344', 'Saul Goodman for President!'),
  ('5c3973b9-f8f6-4002-8fd8-7f53ec56a8cb', 'Apples and bananas');

INSERT INTO users
  (id, user_name)
VALUES
  ('b8f2c19d-b1e4-4b57-adeb-c4236d5c197e', 'Kevin Wei'),
  ('f89e98d9-2f90-4a17-886e-70fa6dc859ac', 'Predoon Nymean');

INSERT INTO users_messages
  (user_id, message_id)
VALUES
  ('b8f2c19d-b1e4-4b57-adeb-c4236d5c197e', 'ac565e23-273d-4d07-adc7-769863ec7344'),
  ('f89e98d9-2f90-4a17-886e-70fa6dc859ac', '5c3973b9-f8f6-4002-8fd8-7f53ec56a8cb');

COMMIT;