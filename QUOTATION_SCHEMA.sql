-- ============================================
-- QUOTATION MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================

-- Table: quotations
-- Stores main quotation records
CREATE TABLE IF NOT EXISTS quotations (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  quotation_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  expired_on DATE,
  note TEXT,
  terms_conditions TEXT,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: quotation_services
-- Stores repair services in each quotation
CREATE TABLE IF NOT EXISTS quotation_services (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  quotation_id INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_code VARCHAR(50),
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  rate_including_tax BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: quotation_parts
-- Stores parts in each quotation
CREATE TABLE IF NOT EXISTS quotation_parts (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  quotation_id INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  part_name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(100),
  description TEXT,
  warranty VARCHAR(100),
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_code VARCHAR(50),
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  rate_including_tax BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotations_company_id ON quotations(company_id);
CREATE INDEX IF NOT EXISTS idx_quotations_quotation_number ON quotations(quotation_number);
CREATE INDEX IF NOT EXISTS idx_quotation_services_company_id ON quotation_services(company_id);
CREATE INDEX IF NOT EXISTS idx_quotation_services_quotation_id ON quotation_services(quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotation_parts_company_id ON quotation_parts(company_id);
CREATE INDEX IF NOT EXISTS idx_quotation_parts_quotation_id ON quotation_parts(quotation_id);

-- ============================================
-- CALCULATION FORMULAS (Backend)
-- ============================================
-- For Services:
--   subtotal = price - discount
--   tax_amount = (subtotal * tax_rate) / 100
--   total = subtotal + tax_amount

-- For Parts:
--   subtotal = (price * quantity) - discount
--   tax_amount = (subtotal * tax_rate) / 100
--   total = subtotal + tax_amount
