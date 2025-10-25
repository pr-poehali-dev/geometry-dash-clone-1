CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_stars INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS level_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  level_id INTEGER NOT NULL,
  attempts INTEGER DEFAULT 0,
  best_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  stars_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  UNIQUE(user_id, level_id)
);

CREATE INDEX IF NOT EXISTS idx_level_records_user_id ON level_records(user_id);
CREATE INDEX IF NOT EXISTS idx_level_records_level_id ON level_records(level_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
