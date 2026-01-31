-- Add status and approved_rejected_by columns to quotations table
ALTER TABLE quotations 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approved_rejected_by VARCHAR(255);

-- Update existing records to have 'pending' status
UPDATE quotations SET status = 'pending' WHERE status IS NULL;