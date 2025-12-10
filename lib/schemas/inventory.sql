-- Inventory parts table schema
CREATE TABLE inventory_parts (
  id SERIAL PRIMARY KEY,
  part_id VARCHAR(50) UNIQUE NOT NULL,
  
  -- Basic Information
  part_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  sub_category VARCHAR(100),
  warranty VARCHAR(100),
  storage_location VARCHAR(100),
  
  -- Stock Information
  opening_stock INTEGER NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  unit_type VARCHAR(50),
  sku VARCHAR(100),
  low_stock_units INTEGER,
  
  -- Barcode Information
  barcode_number VARCHAR(100),
  rate_including_tax BOOLEAN DEFAULT false,
  manage_stock BOOLEAN DEFAULT true,
  low_stock_alert BOOLEAN DEFAULT true,
  
  -- Price Information
  purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  selling_price DECIMAL(10,2),
  tax VARCHAR(50) DEFAULT 'GST 18%',
  hsn_code VARCHAR(20),
  
  -- Description and Images
  part_description TEXT,
  images TEXT[], -- Array of image URLs
  
  -- Status and Timestamps
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_inventory_parts_part_id ON inventory_parts(part_id);
CREATE INDEX idx_inventory_parts_name ON inventory_parts(part_name);
CREATE INDEX idx_inventory_parts_category ON inventory_parts(category);
CREATE INDEX idx_inventory_parts_sku ON inventory_parts(sku);
CREATE INDEX idx_inventory_parts_barcode ON inventory_parts(barcode_number);

-- Function to auto-generate part ID
CREATE OR REPLACE FUNCTION generate_part_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.part_id IS NULL THEN
    NEW.part_id := 'PART' || LPAD(nextval('inventory_parts_id_seq')::text, 4, '0');
  END IF;
  -- Set current_stock to opening_stock on insert
  IF NEW.current_stock = 0 THEN
    NEW.current_stock := NEW.opening_stock;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate part ID
CREATE TRIGGER trigger_generate_part_id
  BEFORE INSERT ON inventory_parts
  FOR EACH ROW
  EXECUTE FUNCTION generate_part_id();

-- Update timestamp trigger
CREATE TRIGGER trigger_update_inventory_parts_updated_at
  BEFORE UPDATE ON inventory_parts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();