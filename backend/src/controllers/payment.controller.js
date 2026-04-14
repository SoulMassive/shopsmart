const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order.model');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/order
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('[Razorpay Order Error]', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
const verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            orderId // Our internal DB order ID
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment success - Update order status
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'Paid',
                paymentDetails: {
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    signature: razorpay_signature
                },
                orderStatus: 'Confirmed'
            });

            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error('[Payment Verification Error]', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment
};
