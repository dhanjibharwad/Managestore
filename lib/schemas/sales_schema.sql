-- Parts Table (for inventory/catalog)
CREATE TABLE parts (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  part_name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255),
  description TEXT,
  warranty VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  tax_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Table (main sale record)
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  sale_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  sale_date DATE NOT NULL,
  referred_by VARCHAR(255),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
  terms_conditions TEXT,
  send_mail BOOLEAN DEFAULT false,
  send_sms BOOLEAN DEFAULT false,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  total_discount DECIMAL(10, 2) DEFAULT 0,
  total_tax DECIMAL(10, 2) DEFAULT 0,
  grand_total DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale Items Table (line items for each sale)
CREATE TABLE sale_items (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  part_id INTEGER REFERENCES parts(id),
  description VARCHAR(255) NOT NULL,
  tax_code VARCHAR(50),
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_parts_company ON parts(company_id);
CREATE INDEX idx_parts_name ON parts(part_name);
CREATE INDEX idx_sales_company ON sales(company_id);
CREATE INDEX idx_sales_number ON sales(sale_number);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_part ON sale_items(part_id);
