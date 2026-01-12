-- Tasks table schema
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(50) UNIQUE NOT NULL,
    task_title VARCHAR(255) NOT NULL,
    task_description TEXT,
    assignee_id INTEGER REFERENCES employees(id),
    due_date TIMESTAMP,
    task_status VARCHAR(50) DEFAULT 'Not Started Yet',
    priority VARCHAR(20) DEFAULT 'Medium',
    customer_id INTEGER REFERENCES customers(id),
    company_id INTEGER NOT NULL REFERENCES companies(id),
    attachments JSONB DEFAULT '[]',
    send_alert JSONB DEFAULT '{"mail": false, "whatsApp": false}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(task_status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Function to generate task ID
CREATE OR REPLACE FUNCTION generate_task_id() RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_id := 'TSK-' || LPAD(counter::TEXT, 6, '0');
        
        IF NOT EXISTS (SELECT 1 FROM tasks WHERE task_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate task_id
CREATE OR REPLACE FUNCTION set_task_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.task_id IS NULL OR NEW.task_id = '' THEN
        NEW.task_id := generate_task_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_task_id
    BEFORE INSERT ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION set_task_id();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();