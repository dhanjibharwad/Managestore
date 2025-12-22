-- Add invitation columns to employees table
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS invitation_status VARCHAR(20) DEFAULT 'pending' CHECK (invitation_status IN ('pending', 'sent', 'accepted', 'expired')),
ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS invitation_token VARCHAR(255);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_invitation_status ON employees(invitation_status);
CREATE INDEX IF NOT EXISTS idx_employees_invitation_token ON employees(invitation_token);
