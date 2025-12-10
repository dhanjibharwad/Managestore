-- Employees table schema
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  
  -- Employee Information
  employee_role VARCHAR(100) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  email_id VARCHAR(255) UNIQUE NOT NULL,
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
  
  -- Status and Timestamps
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_employees_employee_id ON employees(employee_id);
CREATE INDEX idx_employees_email ON employees(email_id);
CREATE INDEX idx_employees_mobile ON employees(mobile_number);
CREATE INDEX idx_employees_role ON employees(employee_role);
CREATE INDEX idx_employees_status ON employees(status);

-- Function to auto-generate employee ID
CREATE OR REPLACE FUNCTION generate_employee_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.employee_id IS NULL THEN
    NEW.employee_id := 'EMP' || LPAD(nextval('employees_id_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate employee ID
CREATE TRIGGER trigger_generate_employee_id
  BEFORE INSERT ON employees
  FOR EACH ROW
  EXECUTE FUNCTION generate_employee_id();

-- Update timestamp trigger
CREATE TRIGGER trigger_update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();