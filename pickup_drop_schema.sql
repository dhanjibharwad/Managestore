-- PostgreSQL Schema for pickup_drop table

CREATE TABLE IF NOT EXISTS pickup_drop (
    id SERIAL PRIMARY KEY,
    pickup_drop_id VARCHAR(50) UNIQUE,
    company_id INTEGER NOT NULL,
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('pickup', 'drop')),
    customer_search VARCHAR(255),
    mobile VARCHAR(15) NOT NULL,
    device_type VARCHAR(100) NOT NULL,
    schedule_date TIMESTAMP NOT NULL,
    assignee_id INTEGER,
    address TEXT NOT NULL,
    saved_response TEXT,
    description TEXT,
    send_alert JSONB DEFAULT '{"mail": false, "sms": false, "inApp": false}'::jsonb,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_pickup_drop_company_id ON pickup_drop(company_id);
CREATE INDEX idx_pickup_drop_status ON pickup_drop(status);
CREATE INDEX idx_pickup_drop_service_type ON pickup_drop(service_type);
CREATE INDEX idx_pickup_drop_assignee_id ON pickup_drop(assignee_id);
CREATE INDEX idx_pickup_drop_schedule_date ON pickup_drop(schedule_date);
CREATE INDEX idx_pickup_drop_mobile ON pickup_drop(mobile);

CREATE OR REPLACE FUNCTION generate_pickup_drop_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.pickup_drop_id := 'PD' || LPAD(NEW.id::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_pickup_drop_id
AFTER INSERT ON pickup_drop
FOR EACH ROW
EXECUTE FUNCTION generate_pickup_drop_id();

CREATE OR REPLACE FUNCTION update_pickup_drop_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_pickup_drop_timestamp
BEFORE UPDATE ON pickup_drop
FOR EACH ROW
EXECUTE FUNCTION update_pickup_drop_timestamp();
