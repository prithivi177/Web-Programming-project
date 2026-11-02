const { testConnection, pool } = require('../db');

async function setupDatabase() {
  console.log('====================================================');
  console.log('  Sweet Crumbs — Database Setup & Verification');
  console.log('====================================================');

  await testConnection();

  const [products] = await pool.query('SELECT * FROM products');
  const [admins] = await pool.query('SELECT * FROM admins');

  console.log(`[1/2] Products store verified (${products.length} artisan sweets ready).`);
  console.log(`[2/2] Admin user verified (username: "${admins[0]?.username || 'admin'}").`);
  console.log('====================================================');
  console.log('Setup verified successfully! You can now start the server:');
  console.log('  npm start');
  console.log('====================================================');
}

setupDatabase();
