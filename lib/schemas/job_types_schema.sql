-- Job Types table schema for PostgreSQL
CREATE TABLE IF NOT EXISTS job_types (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_job_types_company_id ON job_types(company_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_job_types_updated_at 
    BEFORE UPDATE ON job_types 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
