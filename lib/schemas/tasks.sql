-- Drop existing objects if they exist check
DROP TABLE IF EXISTS tasks CASCADE;
DROP SEQUENCE IF EXISTS task_id_seq CASCADE;

-- Create sequence for task_id
CREATE SEQUENCE task_id_seq START 1;

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(20) UNIQUE NOT NULL DEFAULT 'TASK' || LPAD(nextval('task_id_seq')::text, 6, '0'),
    task_title VARCHAR(255) NOT NULL,
    task_description TEXT,
    assignee_id INTEGER,
    due_date TIMESTAMP,
    task_status VARCHAR(50) DEFAULT 'Not Started Yet' CHECK (task_status IN ('Not Started Yet', 'In Progress', 'Completed')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('urgent', 'Medium', 'low')),
    customer_id INTEGER,
    company_id INTEGER NOT NULL,
    attachments JSONB DEFAULT '[]',
    send_alert JSONB DEFAULT '{"mail": false, "whatsApp": false}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

-- Create indexes
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_customer ON tasks(customer_id);
CREATE INDEX idx_tasks_company ON tasks(company_id);
CREATE INDEX idx_tasks_status ON tasks(task_status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);