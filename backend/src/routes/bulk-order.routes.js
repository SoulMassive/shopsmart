const express = require('express');
const router = express.Router();
const {
    submitBulkOrder,
    getBulkOrders,
    updateBulkOrderStatus
} = require('../controllers/bulk-order.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public route to submit an order
router.post('/', submitBulkOrder);

// Admin-only routes to view & update them
router.get('/', protect, adminOnly, getBulkOrders);
router.patch('/:id', protect, adminOnly, updateBulkOrderStatus);

module.exports = router;
