-- Device Management Schema (PostgreSQL)
-- Device types are fixed/global, brands and models are company-specific

-- 1. Device Types Table (Fixed/Global - No company_id)
CREATE TABLE IF NOT EXISTS device_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Device Brands Table (Company-specific)
CREATE TABLE IF NOT EXISTS device_brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  device_type_id INT NOT NULL,
  company_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_type_id) REFERENCES device_types(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_device_type ON device_brands(device_type_id);
CREATE INDEX idx_company_brands ON device_brands(company_id);

-- 3. Device Models Table (Company-specific)
CREATE TABLE IF NOT EXISTS device_models (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  device_brand_id INT NOT NULL,
  company_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_brand_id) REFERENCES device_brands(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_device_brand ON device_models(device_brand_id);
CREATE INDEX idx_company_models ON device_models(company_id);

-- Insert Fixed Device Types (Global for all companies)
INSERT INTO device_types (name) VALUES
('All In One'),
('Camera'),
('CD/DVD'),
('CF Card'),
('Desktop'),
('HDD (2.5 Inch)'),
('HDD (3.5 Inch)'),
('Laptop'),
('Micro SD Card'),
('Mobile'),
('Monitor'),
('Motherboard'),
('NAS Box'),
('Pen Drive'),
('SD Card'),
('Server Hard Drives'),
('SSD'),
('Tablet'),
('Television');

-- Sample Device Brands (Company-specific - Replace company_id with actual)
-- Laptop brands (device_type_id: 8)
INSERT INTO device_brands (name, device_type_id, company_id) VALUES
('Dell', 8, 1),
('HP', 8, 1),
('Lenovo', 8, 1),
('Apple', 8, 1),
('Asus', 8, 1);

-- Mobile brands (device_type_id: 10)
INSERT INTO device_brands (name, device_type_id, company_id) VALUES
('Apple', 10, 1),
('Samsung', 10, 1),
('OnePlus', 10, 1),
('Xiaomi', 10, 1);

-- Sample Device Models (Company-specific - Replace company_id and device_brand_id with actual)
INSERT INTO device_models (name, device_brand_id, company_id) VALUES
('Inspiron 15', 1, 1),
('XPS 13', 1, 1),
('iPhone 15 Pro', 6, 1),
('Galaxy S24', 7, 1);
