-- Fix device_types unique constraint to allow per-company device types

-- Step 1: Drop the old unique constraint on name only
ALTER TABLE device_types DROP CONSTRAINT IF EXISTS device_types_name_key;

-- Step 2: Add company_id column if it doesn't exist
ALTER TABLE device_types ADD COLUMN IF NOT EXISTS company_id INT;

-- Step 3: Add is_default column if it doesn't exist
ALTER TABLE device_types ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Step 4: Add foreign key constraint
ALTER TABLE device_types DROP CONSTRAINT IF EXISTS device_types_company_id_fkey;
ALTER TABLE device_types ADD CONSTRAINT device_types_company_id_fkey 
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- Step 5: Add new unique constraint on (name, company_id)
ALTER TABLE device_types ADD CONSTRAINT device_types_name_company_id_key 
  UNIQUE(name, company_id);

-- Step 6: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_company_device_types ON device_types(company_id);
