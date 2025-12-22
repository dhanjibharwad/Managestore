-- Guest Repair Service Requests Table
-- For users to directly submit repair service requests without authentication

CREATE TABLE guest_repair_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Device Information (Step 1)
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100),
    device_password VARCHAR(255),
    accessories TEXT[],
    device_image_url TEXT,
    device_issue TEXT,
    
    -- Basic Information (Step 2)
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    email VARCHAR(255),
    terms_accepted BOOLEAN DEFAULT false,
    
    -- Pickup Address (Step 3)
    address_line TEXT,
    region VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    pickup_datetime TIMESTAMP,
    
    -- Verification Status (Step 4)
    is_verified BOOLEAN DEFAULT false,
    verification_method VARCHAR(20), -- 'mobile' or 'email'
    
    -- Request Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, completed
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_contact_info CHECK (mobile IS NOT NULL OR email IS NOT NULL)
);

-- Indexes for performance
CREATE INDEX idx_guest_requests_company_id ON guest_repair_requests(company_id);
CREATE INDEX idx_guest_requests_status ON guest_repair_requests(status);
CREATE INDEX idx_guest_requests_email ON guest_repair_requests(email);
CREATE INDEX idx_guest_requests_mobile ON guest_repair_requests(mobile);
CREATE INDEX idx_guest_requests_created_at ON guest_repair_requests(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_guest_repair_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_guest_repair_requests_updated_at
    BEFORE UPDATE ON guest_repair_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_guest_repair_requests_updated_at();
