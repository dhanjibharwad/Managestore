CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  display_name VARCHAR(255),
  alternate_phone VARCHAR(20) CHECK (alternate_phone IS NULL OR alternate_phone ~ '^[6-9][0-9]{9}$'),
  aadhaar_number VARCHAR(12) CHECK (aadhaar_number IS NULL OR aadhaar_number ~ '^[0-9]{12}$'),
  gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
  pan_number VARCHAR(10) CHECK (pan_number IS NULL OR pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
  date_of_birth DATE,
  address_line TEXT,
  state VARCHAR(100),
  city VARCHAR(100),
  postal_code VARCHAR(10) CHECK (postal_code IS NULL OR postal_code ~ '^[0-9]{6}$'),
  account_name VARCHAR(255),
  bank_name VARCHAR(255),
  branch VARCHAR(255),
  account_number VARCHAR(50) CHECK (account_number IS NULL OR account_number ~ '^[0-9]{9,18}$'),
  ifsc_code VARCHAR(11) CHECK (ifsc_code IS NULL OR ifsc_code ~ '^[A-Z]{4}0[A-Z0-9]{6}$'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE (user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_id ON user_profiles(company_id);

-- Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();