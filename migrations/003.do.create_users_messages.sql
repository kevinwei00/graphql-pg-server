CREATE TABLE users_messages (
  user_id uuid REFERENCES users(id),
  message_id uuid REFERENCES messages(id),
  PRIMARY KEY (user_id, message_id)
);