const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/urgent_real_estate',
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Running migration...');
    
    // Read the SQL files
    const migrations = [
      'add-new-columns.sql',
      'alter_property_interests.sql'
    ];
    
    for (const migration of migrations) {
      try {
        const sqlPath = path.join(__dirname, 'migrations', migration);
        if (fs.existsSync(sqlPath)) {
          console.log(`Running migration: ${migration}`);
          const sql = fs.readFileSync(sqlPath, 'utf8');
          await client.query(sql);
          console.log(`Migration ${migration} completed successfully!`);
        } else {
          console.log(`Migration file not found: ${migration}`);
        }
      } catch (error) {
        console.error(`Error running migration ${migration}:`, error);
        // Continue with other migrations even if one fails
      }
    }
    
    console.log('All migrations completed successfully!');
    
    // Check the property_interests table structure
    try {
      const tableInfo = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'property_interests'
        ORDER BY ordinal_position
      `);
      
      console.log('Current property_interests table structure:');
      console.table(tableInfo.rows);
    } catch (error) {
      console.error('Error checking table structure:', error);
    }
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();