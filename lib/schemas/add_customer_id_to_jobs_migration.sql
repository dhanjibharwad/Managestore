-- Migration to add customer_id column to jobs table
-- Run this script to update existing jobs table

-- Add customer_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'jobs' AND column_name = 'customer_id') THEN
        ALTER TABLE jobs ADD COLUMN customer_id INTEGER;
        
        -- Update existing jobs with customer_id where possible
        UPDATE jobs 
        SET customer_id = c.id 
        FROM customers c 
        WHERE jobs.customer_name = c.customer_name 
        AND jobs.company_id = c.company_id;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON jobs(customer_id);
        
        RAISE NOTICE 'Added customer_id column to jobs table and updated existing records';
    ELSE
        RAISE NOTICE 'customer_id column already exists in jobs table';
    END IF;
END $$;