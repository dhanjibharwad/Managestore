-- Create self_checkin_requests table
CREATE TABLE IF NOT EXISTS self_checkin_requests (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Device Information
  device_type VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  serial_number VARCHAR(255),
  device_password VARCHAR(255),
  device_issue TEXT,
  accessories TEXT,
  device_images TEXT[],
  
  -- Customer Information
  customer_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20),
  email VARCHAR(255),
  
  -- Address & Pickup Information
  address_line TEXT,
  region_state VARCHAR(100),
  city_town VARCHAR(100),
  postal_code VARCHAR(20),
  pickup_datetime TIMESTAMP,
  skip_pickup BOOLEAN DEFAULT FALSE,
  
  -- Terms & Status
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending',
  assignee VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_self_checkin_company ON self_checkin_requests(company_id);
CREATE INDEX idx_self_checkin_user ON self_checkin_requests(user_id);
CREATE INDEX idx_self_checkin_status ON self_checkin_requests(status);
CREATE INDEX idx_self_checkin_created ON self_checkin_requests(created_at DESC);
