const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['OrderUpdate', 'PaymentAlert', 'NewOffer', 'SystemAlert', 'ExecAssigned'],
            required: true,
        },
        title: { type: String, required: true },
        body: { type: String, required: true },
        data: { type: mongoose.Schema.Types.Mixed }, // deep-link payload e.g. { orderId }
        isRead: { type: Boolean, default: false },
        readAt: { type: Date },
        channel: {
            type: String,
            enum: ['push', 'email', 'sms', 'inApp'],
            default: 'inApp',
        },
    },
    { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
// TTL: auto-delete notifications older than 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7_776_000 });

module.exports = mongoose.model('Notification', notificationSchema);
