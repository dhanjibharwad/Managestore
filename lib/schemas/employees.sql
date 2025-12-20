-- Employees table schema
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  
  -- Employee Information
  employee_role VARCHAR(100) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  email_id VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  phone_number VARCHAR(20),
  aadhaar_number VARCHAR(12),
  gender VARCHAR(10),
  pan_card VARCHAR(10),
  date_of_birth DATE,
  
  -- Address Details
  address_line TEXT,
  region_state VARCHAR(100),
  city_town VARCHAR(100),
  postal_code VARCHAR(10),
  
  -- Bank Details
  account_name VARCHAR(255),
  bank_name VARCHAR(255),
  branch VARCHAR(255),
  account_number VARCHAR(50),
  ifsc_code VARCHAR(11),
  
  -- Company and User References
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_by INTEGER REFERENCES users(id),
  
  -- Status and Timestamps
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_employees_employee_id ON employees(employee_id);
CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_email ON employees(email_id);
CREATE INDEX idx_employees_mobile ON employees(mobile_number);
CREATE INDEX idx_employees_role ON employees(employee_role);
CREATE INDEX idx_employees_status ON employees(status);

-- Function to auto-generate employee ID per company
CREATE OR REPLACE FUNCTION generate_employee_id()
RETURNS TRIGGER AS $$
DECLARE
    next_id INTEGER;
    formatted_id VARCHAR(50);
BEGIN
    -- Get the next sequence number for this company
    SELECT COALESCE(MAX(CAST(SUBSTRING(employee_id FROM 4) AS INTEGER)), 0) + 1
    INTO next_id
    FROM employees
    WHERE company_id = NEW.company_id;
    
    -- Format as EMP001, EMP002, etc.
    formatted_id := 'EMP' || LPAD(next_id::TEXT, 3, '0');
    
    NEW.employee_id := formatted_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate employee ID
CREATE TRIGGER trigger_generate_employee_id
  BEFORE INSERT ON employees
  FOR EACH ROW
  EXECUTE FUNCTION generate_employee_id();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp trigger
CREATE TRIGGER trigger_update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();