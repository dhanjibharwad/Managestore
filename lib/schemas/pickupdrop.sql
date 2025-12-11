-- Create sequence for pickup_drop_id
CREATE SEQUENCE IF NOT EXISTS pickup_drop_id_seq START 1;

-- Pickup/Drop table
CREATE TABLE pickup_drop (
    id SERIAL PRIMARY KEY,
    pickup_drop_id VARCHAR(20) UNIQUE NOT NULL DEFAULT 'PD' || LPAD(nextval('pickup_drop_id_seq')::text, 6, '0'),
    service_type VARCHAR(10) NOT NULL CHECK (service_type IN ('pickup', 'drop')),
    customer_search VARCHAR(255),
    customer_id INTEGER,
    mobile VARCHAR(20) NOT NULL,
    device_type VARCHAR(100) NOT NULL,
    schedule_date TIMESTAMP NOT NULL,
    assignee_id INTEGER,
    address TEXT NOT NULL,
    saved_response VARCHAR(255),
    description TEXT,
    send_alert JSONB DEFAULT '{"mail": false, "sms": false}',
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_pickup_drop_service_type ON pickup_drop(service_type);
CREATE INDEX idx_pickup_drop_customer ON pickup_drop(customer_id);
CREATE INDEX idx_pickup_drop_assignee ON pickup_drop(assignee_id);
CREATE INDEX idx_pickup_drop_schedule_date ON pickup_drop(schedule_date);
CREATE INDEX idx_pickup_drop_status ON pickup_drop(status);