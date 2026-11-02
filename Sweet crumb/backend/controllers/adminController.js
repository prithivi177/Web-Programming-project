const bcrypt = require('bcryptjs');
const { pool } = require('../db');

// POST /api/admin/login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username.trim()]);
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // Set server-side session
    req.session.adminId = admin.id;
    req.session.username = admin.username;

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error. Please check database connectivity.',
      error: error.message
    });
  }
}

// POST /api/admin/logout
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false, message: 'Could not log out.' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true, message: 'Logged out successfully.' });
  });
}

// GET /api/admin/me
async function getMe(req, res) {
  if (req.session && req.session.adminId) {
    return res.json({
      success: true,
      authenticated: true,
      admin: {
        id: req.session.adminId,
        username: req.session.username
      }
    });
  }
  return res.status(401).json({
    success: false,
    authenticated: false,
    message: 'No active admin session.'
  });
}

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    const [[productsCount]] = await pool.query('SELECT COUNT(*) AS total FROM products');
    const [[ordersCount]] = await pool.query('SELECT COUNT(*) AS total FROM orders');
    const [[pendingOrdersCount]] = await pool.query('SELECT COUNT(*) AS total FROM orders WHERE status = "Pending"');
    const [[enquiriesCount]] = await pool.query('SELECT COUNT(*) AS total FROM enquiries');
    const [[pendingEnquiriesCount]] = await pool.query('SELECT COUNT(*) AS total FROM enquiries WHERE status = "Pending"');
    const [[revenueResult]] = await pool.query('SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE status != "Cancelled"');

    const [recentOrders] = await pool.query(
      'SELECT id, order_reference, customer_name, total_amount, status, created_at FROM orders ORDER BY id DESC LIMIT 5'
    );

    return res.json({
      success: true,
      stats: {
        totalProducts: productsCount.total || 0,
        totalOrders: ordersCount.total || 0,
        pendingOrders: pendingOrdersCount.total || 0,
        totalEnquiries: enquiriesCount.total || 0,
        pendingEnquiries: pendingEnquiriesCount.total || 0,
        totalRevenue: parseFloat(revenueResult.total || 0).toFixed(2),
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bakery analytics.',
      error: error.message
    });
  }
}

module.exports = {
  login,
  logout,
  getMe,
  getStats
};
