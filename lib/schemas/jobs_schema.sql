-- Jobs table schema for PostgreSQL
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(50) UNIQUE NOT NULL DEFAULT ('JOB_' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8))),
    job_number VARCHAR(20) UNIQUE NOT NULL,
    company_id INTEGER NOT NULL,
    
    -- Customer Information
    customer_name VARCHAR(255) NOT NULL,
    source VARCHAR(100) DEFAULT 'Google',
    referred_by VARCHAR(255),
    
    -- Service Information
    service_type VARCHAR(100) DEFAULT 'Carried By User',
    job_type VARCHAR(100) DEFAULT 'No Warranty',
    priority VARCHAR(50) DEFAULT 'Regular',
    assignee VARCHAR(255) NOT NULL,
    
    -- Device Information
    device_type VARCHAR(100) NOT NULL,
    device_brand VARCHAR(100) NOT NULL,
    device_model VARCHAR(100),
    serial_number VARCHAR(255),
    accessories TEXT,
    storage_location VARCHAR(255),
    device_color VARCHAR(50),
    device_password VARCHAR(255),
    
    -- Service Details
    services TEXT NOT NULL,
    tags TEXT,
    hardware_config TEXT,
    service_assessment TEXT,
    
    -- Additional Information
    initial_quotation VARCHAR(100),
    due_date DATE,
    dealer_job_id VARCHAR(100),
    terms_conditions TEXT,
    
    -- File uploads
    images JSONB DEFAULT '[]'::jsonb,
    
    -- Status and tracking
    status VARCHAR(50) DEFAULT 'Pending',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_job_id ON jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_customer_name ON jobs(customer_name);
CREATE INDEX IF NOT EXISTS idx_jobs_assignee ON jobs(assignee);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();