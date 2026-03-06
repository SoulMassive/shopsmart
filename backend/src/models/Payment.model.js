const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        outletId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Outlet',
            required: true,
        },
        amount: { type: Number, required: true, min: 0 },
        method: {
            type: String,
            enum: ['COD', 'UPI', 'NEFT', 'RTGS', 'Credit', 'Card'],
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Success', 'Failed', 'Refunded'],
            default: 'Pending',
        },
        transactionId: { type: String, sparse: true },
        gateway: {
            type: String,
            enum: ['Razorpay', 'Stripe', 'PayU', 'Manual', 'None'],
            default: 'None',
        },
        // Raw gateway payload — never expose to frontend
        gatewayResponse: { type: mongoose.Schema.Types.Mixed, select: false },

        paidAt: { type: Date },
        refundedAt: { type: Date },
        refundAmount: { type: Number, default: 0 },
        note: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ invoiceId: 1 });
paymentSchema.index({ outletId: 1, createdAt: -1 });
paymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
