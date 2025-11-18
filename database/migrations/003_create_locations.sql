-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Locations table with PostGIS support
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID REFERENCES food_trucks(id) ON DELETE CASCADE,
  address VARCHAR(255),
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  location_point GEOMETRY(POINT, 4326),
  scheduled_start TIMESTAMP,
  scheduled_end TIMESTAMP,
  is_current BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'open', -- open, closing_soon, closed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PostGIS index for efficient location queries
CREATE INDEX idx_locations_point ON locations USING GIST (location_point);

-- Trigger to update location_point from latitude/longitude
CREATE OR REPLACE FUNCTION update_location_point()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location_point = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_location_point
  BEFORE INSERT OR UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_location_point();