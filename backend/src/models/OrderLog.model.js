const mongoose = require('mongoose');

// Immutable — once created, never updated
const orderLogSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        fromStatus: { type: String },
        toStatus: { type: String, required: true },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        note: { type: String },
    },
    {
        timestamps: true,
        // Prevent accidental updates to this immutable log
    }
);

orderLogSchema.index({ orderId: 1, createdAt: 1 });

// Make this collection truly immutable
orderLogSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function () {
    throw new Error('OrderLog is immutable — use insertOne only.');
});

module.exports = mongoose.model('OrderLog', orderLogSchema);
