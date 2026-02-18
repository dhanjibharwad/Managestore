-- Function to automatically create default device types for new companies
-- This can be called when a new company is created

CREATE OR REPLACE FUNCTION create_default_device_types_for_company(p_company_id INT)
RETURNS void AS $$
BEGIN
  INSERT INTO device_types (name, company_id, is_default)
  VALUES
    ('All In One', p_company_id, true),
    ('Camera', p_company_id, true),
    ('CD/DVD', p_company_id, true),
    ('CF Card', p_company_id, true),
    ('Desktop', p_company_id, true),
    ('HDD (2.5 Inch)', p_company_id, true),
    ('HDD (3.5 Inch)', p_company_id, true),
    ('Laptop', p_company_id, true),
    ('Micro SD Card', p_company_id, true),
    ('Mobile', p_company_id, true),
    ('Monitor', p_company_id, true),
    ('Motherboard', p_company_id, true),
    ('NAS Box', p_company_id, true),
    ('Pen Drive', p_company_id, true),
    ('SD Card', p_company_id, true),
    ('Server Hard Drives', p_company_id, true),
    ('SSD', p_company_id, true),
    ('Tablet', p_company_id, true),
    ('Television', p_company_id, true)
  ON CONFLICT (name, company_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create default device types when a new company is created
CREATE OR REPLACE FUNCTION trigger_create_default_device_types()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_default_device_types_for_company(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_company_insert ON companies;
CREATE TRIGGER after_company_insert
  AFTER INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_default_device_types();
