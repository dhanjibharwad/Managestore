-- Device Colors Table (Company-Specific)
CREATE TABLE IF NOT EXISTS device_colors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color_code VARCHAR(7) NOT NULL,
  company_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE(name, company_id)
);

CREATE INDEX idx_company_device_colors ON device_colors(company_id);
