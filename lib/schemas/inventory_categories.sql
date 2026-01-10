-- Categories and Subcategories Schema for PostgreSQL

-- Categories table
CREATE TABLE inventory_categories (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    category_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_category_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_category_user FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT unique_category_per_company UNIQUE(company_id, category_name)
);

-- Subcategories table
CREATE TABLE inventory_subcategories (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    subcategory_name VARCHAR(100) NOT NULL,
    subcategory_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_subcategory_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_subcategory_category FOREIGN KEY (category_id) REFERENCES inventory_categories(id) ON DELETE CASCADE,
    CONSTRAINT fk_subcategory_user FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT unique_subcategory_per_category UNIQUE(category_id, subcategory_name)
);

-- Indexes for better performance
CREATE INDEX idx_categories_company ON inventory_categories(company_id);
CREATE INDEX idx_categories_active ON inventory_categories(is_active);
CREATE INDEX idx_subcategories_company ON inventory_subcategories(company_id);
CREATE INDEX idx_subcategories_category ON inventory_subcategories(category_id);
CREATE INDEX idx_subcategories_active ON inventory_subcategories(is_active);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON inventory_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON inventory_subcategories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();