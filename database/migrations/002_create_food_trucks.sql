-- Food trucks table
CREATE TABLE food_trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  truck_name VARCHAR(255) NOT NULL,
  cuisine_types TEXT[] NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  cover_photo_url VARCHAR(500),
  contact_phone VARCHAR(20),
  social_links JSONB,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);