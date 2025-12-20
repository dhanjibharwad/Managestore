-- Alternative Expenses Table Schema (Company-level only)
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    expense_id VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated expense ID (e.g., EXP-001)
    expense_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('food', 'utilities', 'transportation', 'salaries', 'rent', 'other')),
    expense_date DATE NOT NULL,
    description TEXT,
    payment_mode VARCHAR(20) NOT NULL CHECK (payment_mode IN ('cash', 'online', 'card', 'phonepay', 'cheque')),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    attachments JSONB,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_by VARCHAR(255), -- Optional: Store creator name as text instead of foreign key
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_expenses_company_id ON expenses(company_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);

-- Function to auto-generate expense_id
CREATE OR REPLACE FUNCTION generate_expense_id()
RETURNS TRIGGER AS $$
DECLARE
    next_id INTEGER;
    formatted_id VARCHAR(50);
BEGIN
    -- Get the next sequence number for this company
    SELECT COALESCE(MAX(CAST(SUBSTRING(expense_id FROM 5) AS INTEGER)), 0) + 1
    INTO next_id
    FROM expenses
    WHERE company_id = NEW.company_id;
    
    -- Format as EXP-001, EXP-002, etc.
    formatted_id := 'EXP-' || LPAD(next_id::TEXT, 3, '0');
    
    NEW.expense_id := formatted_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate expense_id before insert
CREATE TRIGGER trigger_generate_expense_id
    BEFORE INSERT ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION generate_expense_id();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER trigger_update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();