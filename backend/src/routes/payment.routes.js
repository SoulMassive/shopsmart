const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
