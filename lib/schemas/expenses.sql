-- Create sequence for expense_id
CREATE SEQUENCE IF NOT EXISTS expense_id_seq START 1;

-- Expenses table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    expense_id VARCHAR(20) UNIQUE NOT NULL DEFAULT 'EXP' || LPAD(nextval('expense_id_seq')::text, 6, '0'),
    expense_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    payment_mode VARCHAR(50) NOT NULL CHECK (payment_mode IN ('cash', 'online', 'card', 'phonepay', 'cheque')),
    amount DECIMAL(10,2) NOT NULL,
    attachments JSONB DEFAULT '[]',
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_payment_mode ON expenses(payment_mode);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);
CREATE INDEX idx_expenses_amount ON expenses(amount);