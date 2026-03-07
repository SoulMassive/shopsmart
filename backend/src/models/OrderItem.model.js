const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        // Denormalized for analytics — no joins needed for brand/category reports
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },

        // Price snapshot — preserves the exact values at time of order
        name: { type: String, required: true },
        sku: { type: String, required: true },
        image: { type: String },
        unitPrice: { type: Number, required: true, min: 0 },
        unit: { type: String },
        brandName: { type: String },
        weightInKg: { type: Number, default: 0 },

        quantity: { type: Number, required: true, min: 1, max: 10000 },
        discountAmount: { type: Number, default: 0 },
        subtotal: { type: Number, required: true, min: 0 },

        // Partial fulfillment tracking
        fulfilledQty: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['Pending', 'Fulfilled', 'Cancelled'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

orderItemSchema.index({ orderId: 1 });
orderItemSchema.index({ productId: 1 });
orderItemSchema.index({ brandId: 1, createdAt: -1 });
orderItemSchema.index({ categoryId: 1, createdAt: -1 });

module.exports = mongoose.model('OrderItem', orderItemSchema);
