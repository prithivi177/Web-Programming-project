const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');

// Load environment variables from .env with override enabled
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath, override: true });

const { testConnection } = require('./db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for development flexibility and cross-origin access
app.use(cors({
  origin: (origin, callback) => {
    // Allow any origin (including file://, localhost:5500, or same origin)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Session configuration for admin authentication
app.use(session({
  name: 'sweet_crumbs.sid',
  secret: process.env.SESSION_SECRET || 'sweet_crumbs_session_secret_key_college_project_2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true only if behind HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Static files: serve the complete frontend website from the same origin
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'Sweet Crumbs — Bakery Company Website',
    timestamp: new Date().toISOString()
  });
});

// REST API routes: Support both /api/products and /api/sweets
app.use('/api/products', productRoutes);
app.use('/api/sweets', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);

// Catch-all for API 404s
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Express server
const server = app.listen(PORT, async () => {
  console.log('================================================================');
  console.log('       🍰 SWEET CRUMBS — BAKERY COMPANY PROFILE WEBSITE         ');
  console.log('================================================================');
  console.log(`✓ Server running at: http://localhost:${PORT}`);
  console.log(`✓ Home Page:         http://localhost:${PORT}/index.html`);
  console.log(`✓ About Us:          http://localhost:${PORT}/about.html`);
  console.log(`✓ Products Catalog:  http://localhost:${PORT}/products.html`);
  console.log(`✓ Order Online:      http://localhost:${PORT}/order.html`);
  console.log(`✓ Contact Us:        http://localhost:${PORT}/contact.html`);
  console.log(`✓ Admin Login:       http://localhost:${PORT}/admin-login.html`);
  console.log(`✓ Admin Dashboard:   http://localhost:${PORT}/admin-dashboard.html`);
  console.log(`✓ Products API:      http://localhost:${PORT}/api/products`);
  console.log(`✓ Sweets API:        http://localhost:${PORT}/api/sweets`);
  console.log('----------------------------------------------------------------');

  // Verify MySQL database connectivity
  await testConnection();
});

module.exports = app;
