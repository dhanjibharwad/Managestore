-- Jobs table schema
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  job_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- Customer Information
  customer_name VARCHAR(255) NOT NULL,
  source VARCHAR(100) DEFAULT 'Google',
  referred_by VARCHAR(255),
  
  -- Service Information
  service_type VARCHAR(100) NOT NULL DEFAULT 'Carried By User',
  job_type VARCHAR(100) NOT NULL DEFAULT 'No Warranty',
  
  -- Device Information
  device_type VARCHAR(100) NOT NULL,
  device_brand VARCHAR(100) NOT NULL,
  device_model VARCHAR(100),
  serial_number VARCHAR(255),
  accessories TEXT,
  storage_location VARCHAR(100),
  device_color VARCHAR(50),
  device_password VARCHAR(255),
  
  -- Service Details
  services TEXT NOT NULL,
  tags TEXT,
  hardware_config TEXT,
  service_assessment TEXT,
  
  -- Additional Information
  priority VARCHAR(50) NOT NULL DEFAULT 'Regular',
  assignee VARCHAR(255) NOT NULL,
  initial_quotation VARCHAR(100),
  due_date DATE,
  dealer_job_id VARCHAR(100),
  terms_conditions TEXT,
  
  -- Images
  images TEXT[], -- Array of image URLs
  
  -- Status and Timestamps
  status VARCHAR(50) DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

-- Create index for better performance
CREATE INDEX idx_jobs_job_number ON jobs(job_number);
CREATE INDEX idx_jobs_customer_name ON jobs(customer_name);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_assignee ON jobs(assignee);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

-- Function to auto-generate job number
CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_number IS NULL THEN
    NEW.job_number := 'JOB' || LPAD(nextval('jobs_id_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate job number
CREATE TRIGGER trigger_generate_job_number
  BEFORE INSERT ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION generate_job_number();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();