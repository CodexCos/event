const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const setup = async () => {
  try {
    console.log('Reading schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Connecting to PostgreSQL database and executing schema statements...');
    await pool.query(sql);

    console.log('✅ Database schema loaded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error loading database schema:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('\n[Tip] Could not connect to PostgreSQL. Please ensure:');
      console.error('1. The PostgreSQL service is running on your computer.');
      console.error('2. The credentials/port in your server/.env file are correct.');
    }
    process.exit(1);
  }
};

setup();
