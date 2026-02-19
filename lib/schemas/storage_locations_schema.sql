-- Storage Locations table schema for PostgreSQL
CREATE TABLE IF NOT EXISTS storage_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, company_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_storage_locations_company_id ON storage_locations(company_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_storage_locations_updated_at 
    BEFORE UPDATE ON storage_locations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
