-- Migration Script: Make Device Types Company-Specific
-- Run this script to migrate from global device types to company-specific

BEGIN;

-- Step 1: Add company_id column to existing device_types table
ALTER TABLE device_types ADD COLUMN IF NOT EXISTS company_id INT;
ALTER TABLE device_types ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Step 2: For each company, duplicate all existing device types
INSERT INTO device_types (name, company_id, is_default, created_at, updated_at)
SELECT 
  dt.name,
  c.id as company_id,
  true as is_default,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM (SELECT DISTINCT name FROM device_types WHERE company_id IS NULL) dt
CROSS JOIN companies c
ON CONFLICT DO NOTHING;

-- Step 3: Delete old global device types (where company_id is NULL)
DELETE FROM device_types WHERE company_id IS NULL;

-- Step 4: Make company_id NOT NULL
ALTER TABLE device_types ALTER COLUMN company_id SET NOT NULL;

-- Step 5: Add foreign key constraint
ALTER TABLE device_types ADD CONSTRAINT device_types_company_id_fkey 
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- Step 6: Add unique constraint
ALTER TABLE device_types ADD CONSTRAINT device_types_name_company_unique 
  UNIQUE(name, company_id);

-- Step 7: Create index
CREATE INDEX IF NOT EXISTS idx_company_device_types ON device_types(company_id);

COMMIT;
