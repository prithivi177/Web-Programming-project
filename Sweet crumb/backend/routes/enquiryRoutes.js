const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// Public contact enquiry submission
router.post('/', enquiryController.createEnquiry);

module.exports = router;
