-- Part Suppliers Table Schema
CREATE TABLE part_suppliers (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(10) NOT NULL,
    phone_number VARCHAR(15),
    tax_number VARCHAR(50),
    email_id VARCHAR(255),
    address_line TEXT,
    region_state VARCHAR(100),
    city_town VARCHAR(100),
    postal_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_part_suppliers_company ON part_suppliers(company_id);
CREATE INDEX idx_part_suppliers_mobile ON part_suppliers(mobile_number);
CREATE INDEX idx_part_suppliers_email ON part_suppliers(email_id);
CREATE INDEX idx_part_suppliers_name ON part_suppliers(supplier_name);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_part_suppliers_updated_at 
    BEFORE UPDATE ON part_suppliers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();