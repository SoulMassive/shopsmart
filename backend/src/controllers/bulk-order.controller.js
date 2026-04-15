const BulkOrder = require('../models/BulkOrder.model');

// @desc    Submit a new bulk order request
// @route   POST /api/bulk-order
// @access  Public
exports.submitBulkOrder = async (req, res) => {
    try {
        const { name, phone, email, productName, quantity, requirements } = req.body;

        if (!name || !phone || !email || !productName || !quantity) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const newOrder = await BulkOrder.create({
            name,
            phone,
            email,
            productName,
            quantity,
            requirements
        });

        // ----------------------------------------------------
        // NOTIFICATION LOGIC (Option 2/3)
        // Simulate sending an email/WhatsApp notification
        // In reality, you would use node-mailer or Twilio SDK here
        console.log(`[NOTIFICATION] New Bulk Order from ${name} (${phone}) for ${quantity} of ${productName}. Needs attention.`);
        // ----------------------------------------------------

        res.status(201).json({ message: 'Bulk order submitted successfully.', order: newOrder });
    } catch (error) {
        console.error('Bulk order submission error:', error);
        res.status(500).json({ message: 'Server error while submitting bulk order.' });
    }
};

// @desc    Get all bulk order requests (for admin)
// @route   GET /api/bulk-order
// @access  Private/Admin
exports.getBulkOrders = async (req, res) => {
    try {
        const orders = await BulkOrder.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Get bulk orders error:', error);
        res.status(500).json({ message: 'Server error while fetching bulk orders.' });
    }
};

// @desc    Update a bulk order request status
// @route   PATCH /api/bulk-order/:id
// @access  Private/Admin
exports.updateBulkOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, contacted } = req.body;

        const order = await BulkOrder.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found.' });

        if (status) order.status = status;
        if (contacted !== undefined) order.contacted = contacted;

        await order.save();
        res.status(200).json({ message: 'Bulk order updated successfully.', order });
    } catch (error) {
        console.error('Update bulk order status error:', error);
        res.status(500).json({ message: 'Server error while updating bulk order.' });
    }
};
