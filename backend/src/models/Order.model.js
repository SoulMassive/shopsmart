const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },

        // Who placed the order and for which outlet
        outletId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Outlet',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        // Populated when an executive places on behalf of an outlet
        executiveId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        // Snapshot of shipping address at time of order — don't reference Outlet
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, default: 'India' },
        },

        // References to separate OrderItem documents
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
        itemCount: { type: Number, required: true, min: 1 },

        // Financials
        subtotal: { type: Number, required: true, min: 0 },
        discountAmount: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        shippingCost: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true, min: 0 },

        // Payment
        paymentMethod: {
            type: String,
            enum: ['COD', 'Online', 'Credit'],
            default: 'COD',
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
            default: 'Pending',
        },

        // Lifecycle status
        orderStatus: {
            type: String,
            enum: ['Draft', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'],
            default: 'Confirmed',
        },

        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
            default: null,
        },

        notes: { type: String },
        cancelReason: { type: String },
        expectedDeliveryAt: { type: Date },
        deliveredAt: { type: Date },

        // Soft delete & audit
        deletedAt: { type: Date, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// Note: orderNumber index created automatically by unique: true on the field.
orderSchema.index({ outletId: 1, createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ invoiceId: 1 });
orderSchema.index({ outletId: 1, orderStatus: 1, createdAt: -1 }); // dashboard compound

// ── Statics ──────────────────────────────────────────────────────────────────
// Generate a human-readable sequential order number
orderSchema.statics.generateOrderNumber = async function () {
    const year = new Date().getFullYear();
    const count = await this.countDocuments();
    return `SM-${year}-${String(count + 1).padStart(6, '0')}`;
};

module.exports = mongoose.model('Order', orderSchema);
