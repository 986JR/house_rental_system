-- Add created_by column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by BIGINT REFERENCES users(id) ON DELETE SET NULL;

-- Add approved column to properties table if not exists
ALTER TABLE properties ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT FALSE;

-- Approve existing properties to preserve seed data
UPDATE properties SET approved = TRUE;
