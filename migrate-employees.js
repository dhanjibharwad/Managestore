const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Qwerty123@11@localhost:5432/storemanager'
});

async function migrate() {
  try {
    console.log('Adding invitation columns to employees table...');
    
    await pool.query(`
      ALTER TABLE employees 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS invitation_status VARCHAR(20) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS invitation_token VARCHAR(255);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_employees_invitation_token ON employees(invitation_token);
    `);
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
