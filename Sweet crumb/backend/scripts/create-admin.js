const bcrypt = require('bcryptjs');
const { pool } = require('../db');

async function createAdmin() {
  const args = process.argv.slice(2);
  const username = args[0] || 'admin';
  const password = args[1] || 'Admin@123';

  console.log('====================================================');
  console.log('  Sweet Crumbs — Create / Update Admin Account');
  console.log('====================================================');
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [existing] = await pool.query(
      'SELECT id FROM admins WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE admins SET password_hash = ? WHERE username = ?',
        [passwordHash, username]
      );
      console.log(`✓ Admin user "${username}" password updated successfully.`);
    } else {
      await pool.query(
        'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
        [username, passwordHash]
      );
      console.log(`✓ Admin user "${username}" created successfully.`);
    }

    console.log('====================================================');
  } catch (error) {
    console.error('[ERROR creating admin]:', error.message);
    process.exit(1);
  }
}

createAdmin();
