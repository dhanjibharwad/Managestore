-- ============================================
-- PURCHASE MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================

-- Table: purchases
-- Stores main purchase records
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  purchase_number VARCHAR(50) NOT NULL UNIQUE,
  supplier_name VARCHAR(255) NOT NULL,
  party_invoice_number VARCHAR(100),
  purchase_date DATE NOT NULL,
  due_date DATE,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
  payment_mode VARCHAR(50),
  amount DECIMAL(10, 2),
  terms_conditions TEXT,
  attachments JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: purchase_items
-- Stores individual items/parts in each purchase
CREATE TABLE IF NOT EXISTS purchase_items (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL,
  purchase_id INTEGER NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  part_name VARCHAR(255) NOT NULL,
  description TEXT,
  warranty VARCHAR(100),
  tax_code VARCHAR(50),
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  rate_including_tax BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchases_company_id ON purchases(company_id);
CREATE INDEX IF NOT EXISTS idx_purchases_purchase_number ON purchases(purchase_number);
CREATE INDEX IF NOT EXISTS idx_purchase_items_company_id ON purchase_items(company_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON purchase_items(purchase_id);

-- ============================================
-- FIELD DESCRIPTIONS
-- ============================================

-- purchases table:
--   id: Auto-increment primary key
--   company_id: Reference to company (required)
--   purchase_number: Unique purchase identifier (required)
--   supplier_name: Name of the supplier (required)
--   party_invoice_number: Supplier's invoice number (optional)
--   purchase_date: Date of purchase (required)
--   due_date: Payment due date (optional)
--   payment_status: paid/partially-paid/unpaid (default: unpaid)
--   payment_mode: Cash/Card/Bank Transfer/Cheque (optional)
--   amount: Total payment amount (optional)
--   terms_conditions: Purchase terms and conditions (optional)
--   attachments: JSON array of uploaded files (optional)

-- purchase_items table:
--   id: Auto-increment primary key
--   company_id: Reference to company (required)
--   purchase_id: Foreign key to purchases table (required)
--   part_name: Name of the part (required)
--   description: Part description (optional)
--   warranty: Warranty information (optional)
--   tax_code: Tax code like HSN (optional)
--   quantity: Quantity purchased (required)
--   price: Unit price (required)
--   discount: Discount amount (default: 0)
--   tax_rate: Tax percentage (default: 0)
--   tax_amount: Calculated tax amount (default: 0)
--   subtotal: (price * quantity) - discount (required)
--   total: subtotal + tax_amount (required)
--   rate_including_tax: Whether price includes tax (default: false)

-- ============================================
-- CALCULATION FORMULAS (Backend)
-- ============================================
-- subtotal = (price * quantity) - discount
-- tax_amount = (subtotal * tax_rate) / 100
-- total = subtotal + tax_amount
