const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Public order placement
router.post('/', orderController.createOrder);

module.exports = router;
