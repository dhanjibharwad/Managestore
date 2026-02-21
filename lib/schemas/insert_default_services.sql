INSERT INTO services (company_id, device_type_id, name, rate_includes_tax)
SELECT c.id, dt.id, s.name, false
FROM companies c
CROSS JOIN device_types dt
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
