-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),  -- Optional phone number
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,  -- Link to company (NULL for superadmin),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('superadmin', 'admin', 'technician', 'customer')),
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,  -- Track last login
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP/Verification tokens table
CREATE TABLE verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email_verification', 'password_reset')),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX idx_verification_tokens_user_id ON verification_tokens(user_id);
CREATE INDEX idx_users_email ON users(email);

-- ADD: company_id column
ALTER TABLE verification_tokens ADD COLUMN company_id INTEGER 
    REFERENCES companies(id) ON DELETE CASCADE;

-- UPDATE: Populate existing tokens
UPDATE verification_tokens vt
SET company_id = (SELECT company_id FROM users WHERE id = vt.user_id);

-- ADD: Index for performance
CREATE INDEX idx_verification_tokens_company_id ON verification_tokens(company_id);

-- UPDATE: Add 'company_invite' to type check
ALTER TABLE verification_tokens DROP CONSTRAINT verification_tokens_type_check;
ALTER TABLE verification_tokens ADD CONSTRAINT verification_tokens_type_check 
    CHECK (type IN ('email_verification', 'password_reset', 'company_invite'));



-- ADD: company_id column seesions
ALTER TABLE sessions ADD COLUMN company_id INTEGER 
    REFERENCES companies(id) ON DELETE CASCADE;

-- UPDATE: Populate existing sessions
UPDATE sessions s
SET company_id = (SELECT company_id FROM users WHERE id = s.user_id);

-- ADD: Index for performance
CREATE INDEX idx_sessions_company_id ON sessions(company_id);