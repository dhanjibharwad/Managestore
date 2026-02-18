-- Updated Device Management Schema (PostgreSQL)
-- All tables are now company-specific

-- 1. Device Types Table (NOW COMPANY-SPECIFIC)
CREATE TABLE IF NOT EXISTS device_types_new (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  company_id INT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE(name, company_id)
);

CREATE INDEX idx_company_device_types ON device_types_new(company_id);

-- Migration: Copy existing device types to all companies
INSERT INTO device_types_new (name, company_id, is_default)
SELECT dt.name, c.id, true
FROM device_types dt
CROSS JOIN companies c
ON CONFLICT (name, company_id) DO NOTHING;

-- Update device_brands to reference new table (after data migration)
-- ALTER TABLE device_brands DROP CONSTRAINT device_brands_device_type_id_fkey;
-- ALTER TABLE device_brands ADD CONSTRAINT device_brands_device_type_id_fkey 
--   FOREIGN KEY (device_type_id) REFERENCES device_types_new(id) ON DELETE CASCADE;

-- Drop old table and rename new one
-- DROP TABLE device_types;
-- ALTER TABLE device_types_new RENAME TO device_types;
