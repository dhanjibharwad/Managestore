-- Customers table schema
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  customer_id VARCHAR(50) UNIQUE NOT NULL,
  
  -- Customer Information
  customer_type VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(15),
  email_id VARCHAR(255),
  phone_number VARCHAR(15),
  source VARCHAR(100),
  referred_by VARCHAR(255),
  
  -- Address Details
  address_line TEXT,
  region_state VARCHAR(100),
  city_town VARCHAR(100),
  postal_code VARCHAR(10),
  
  -- Status and Timestamps
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_customers_customer_id ON customers(customer_id);
CREATE INDEX idx_customers_mobile ON customers(mobile_number);
CREATE INDEX idx_customers_email ON customers(email_id);
CREATE INDEX idx_customers_name ON customers(customer_name);
CREATE INDEX idx_customers_type ON customers(customer_type);

-- Function to auto-generate customer ID
CREATE OR REPLACE FUNCTION generate_customer_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_id IS NULL THEN
    NEW.customer_id := 'CUST' || LPAD(nextval('customers_id_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate customer ID
CREATE TRIGGER trigger_generate_customer_id
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION generate_customer_id();

-- Update timestamp trigger
CREATE TRIGGER trigger_update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();