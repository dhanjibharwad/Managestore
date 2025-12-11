-- Companies table (created by super-admin)
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    
    -- Subscription and status
    subscription_plan VARCHAR(50) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'pro', 'enterprise')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    
    -- Subscription dates
    subscription_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_end_date TIMESTAMP,
    
    -- Metadata
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for companies table
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_subscription_plan ON companies(subscription_plan);
CREATE INDEX idx_companies_created_by ON companies(created_by);