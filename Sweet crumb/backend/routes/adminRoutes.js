const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const enquiryController = require('../controllers/enquiryController');
const { requireAdmin } = require('../middleware/auth');
const { loginRateLimiter } = require('../middleware/rateLimiter');

// Authentication routes
router.post('/login', loginRateLimiter, adminController.login);
router.post('/logout', adminController.logout);
router.get('/me', adminController.getMe);

// Protected admin routes
router.use(requireAdmin);

// Dashboard statistics
router.get('/stats', adminController.getStats);

// Orders management
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderDetails);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

// Enquiries management
router.get('/enquiries', enquiryController.getEnquiries);
router.patch('/enquiries/:id/status', enquiryController.updateEnquiryStatus);

// Product management (CRUD)
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
