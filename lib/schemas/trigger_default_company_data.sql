CREATE OR REPLACE FUNCTION insert_default_company_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert default job types
    INSERT INTO job_types (company_id, name)
    VALUES 
        (NEW.id, 'Free'),
        (NEW.id, 'Return'),
        (NEW.id, 'AMC'),
        (NEW.id, 'Warranty'),
        (NEW.id, 'No Warranty')
    ON CONFLICT (company_id, name) DO NOTHING;

    -- Insert default sources
    INSERT INTO sources (company_id, name)
    VALUES 
        (NEW.id, 'Just Dial'),
        (NEW.id, 'Referral'),
        (NEW.id, 'Google'),
        (NEW.id, 'Walk In')
    ON CONFLICT (company_id, name) DO NOTHING;

    -- Insert default services for Laptop device type
    INSERT INTO services (company_id, device_type_id, name, rate_includes_tax)
    SELECT NEW.id, dt.id, s.name, false
    FROM device_types dt
    CROSS JOIN (VALUES 
        ('Speakers not working properly'),
        ('Microphone not working'),
        ('Touchpad Not Works'),
        ('USB not working'),
        ('Camera not working'),
        ('Servicing'),
        ('Noisy fan'),
        ('Bad hard disk'),
        ('Os Won''t Boot'),
        ('Hinges broken'),
        ('Display Cracked'),
        ('Laptop shuts down unexpectedly'),
        ('Repetitive beep sound on starting')
    ) AS s(name)
    WHERE dt.name = 'Laptop'
    ON CONFLICT (company_id, device_type_id, name) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_insert_default_company_data ON companies;

CREATE TRIGGER trigger_insert_default_company_data
    AFTER INSERT ON companies
    FOR EACH ROW
    EXECUTE FUNCTION insert_default_company_data();
