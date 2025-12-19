-- Create customer_invites table for storing customer invitation tokens
CREATE TABLE IF NOT EXISTS customer_invites (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    used_at TIMESTAMP NULL,
    UNIQUE(email)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customer_invites_token ON customer_invites(token);
CREATE INDEX IF NOT EXISTS idx_customer_invites_email ON customer_invites(email);
CREATE INDEX IF NOT EXISTS idx_customer_invites_company_id ON customer_invites(company_id);