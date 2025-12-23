-- AMC Contracts Table
CREATE TABLE amc_contracts (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  assignee VARCHAR(255) NOT NULL,
  amc_type VARCHAR(50) NOT NULL,
  contract_start_date DATE NOT NULL,
  contract_end_date DATE NOT NULL,
  devices_covered INTEGER,
  response_time_value INTEGER,
  response_time_unit VARCHAR(20),
  number_of_services INTEGER,
  service_options VARCHAR(100),
  auto_renew BOOLEAN DEFAULT false,
  payment_frequency VARCHAR(50),
  amount DECIMAL(10, 2),
  contract_remark TEXT,
  terms_conditions TEXT,
  images TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_id ON amc_contracts(company_id);
CREATE INDEX idx_customer_name ON amc_contracts(customer_name);
CREATE INDEX idx_contract_dates ON amc_contracts(contract_start_date, contract_end_date);
