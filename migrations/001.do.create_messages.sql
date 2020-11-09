CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL
);