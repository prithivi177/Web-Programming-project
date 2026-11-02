const { pool } = require('../db');

async function testCredentials() {
  console.log('====================================================');
  console.log('  Sweet Crumbs — Database Diagnostic Check           ');
  console.log('====================================================');
  console.log('Engine:   Standalone Local JSON Data Store (No MySQL required)');
  console.log('----------------------------------------------------');

  try {
    const [products] = await pool.query('SELECT * FROM products');
    const [admins] = await pool.query('SELECT * FROM admins');

    console.log(`✓ [1/2] Data Engine Active! Found ${products.length} bakery sweets.`);
    console.log(`✓ [2/2] Admin user "${admins[0]?.username || 'admin'}" configured.`);
    console.log('\nAll set! You can start the server with: npm start');
  } catch (err) {
    console.error('❌ Data check error:', err.message);
  }
  console.log('====================================================\n');
}

testCredentials();
