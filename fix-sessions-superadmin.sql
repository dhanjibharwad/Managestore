-- Migration: Allow NULL company_id in sessions table for superadmin users
-- This allows superadmin users (who have company_id = NULL) to create sessions

-- Drop the existing foreign key constraint
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_company_id_fkey;

-- Add the foreign key constraint back, but allow NULL values
ALTER TABLE sessions 
ADD CONSTRAINT sessions_company_id_fkey 
FOREIGN KEY (company_id) 
REFERENCES companies(id) 
ON DELETE CASCADE;

-- Note: PostgreSQL foreign keys automatically allow NULL values unless the column is NOT NULL
-- So this will work for superadmin sessions with company_id = NULL
