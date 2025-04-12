-- Create property_interests table
CREATE TABLE IF NOT EXISTS property_interests (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Add index for faster lookups by property_id
CREATE INDEX IF NOT EXISTS idx_property_interests_property_id ON property_interests(property_id);

-- Add index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_property_interests_email ON property_interests(email);