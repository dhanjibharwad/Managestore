-- Leads Management Schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  lead_type VARCHAR(50),
  lead_name VARCHAR(255) NOT NULL,
  lead_source VARCHAR(100),
  referred_by VARCHAR(255),
  mobile_number VARCHAR(15),
  email_id VARCHAR(255),
  phone_number VARCHAR(20),
  contact_person VARCHAR(255),
  next_follow_up DATE,
  assignee_id INT NOT NULL,
  device_type_id INT,
  device_brand_id INT,
  device_model_id INT,
  comment TEXT,
  address_line VARCHAR(500),
  region VARCHAR(100),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  company_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignee_id) REFERENCES users(id),
  FOREIGN KEY (device_type_id) REFERENCES device_types(id),
  FOREIGN KEY (device_brand_id) REFERENCES device_brands(id),
  FOREIGN KEY (device_model_id) REFERENCES device_models(id),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_leads_company ON leads(company_id);
CREATE INDEX idx_leads_assignee ON leads(assignee_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);
