INSERT INTO job_types (company_id, name)
SELECT c.id, jt.name
FROM companies c
CROSS JOIN (VALUES ('Free'), ('Return'), ('AMC'), ('Warranty'), ('No Warranty')) AS jt(name)
ON CONFLICT (company_id, name) DO NOTHING;
