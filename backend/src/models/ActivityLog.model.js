const mongoose = require('mongoose');

// Immutable audit trail — append-only, never modified
const activityLogSchema = new mongoose.Schema(
    {
        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        actorRole: { type: String, required: true }, // snapshot of role at the time
        action: {
            type: String,
            required: true,
            // Examples: CREATE_ORDER, UPDATE_PRODUCT, DELETE_OUTLET, CHANGE_STATUS
        },
        collectionName: { type: String, required: true }, // 'orders', 'products', etc.
        documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
        before: { type: mongoose.Schema.Types.Mixed }, // state before
        after: { type: mongoose.Schema.Types.Mixed },  // state after
        ipAddress: { type: String },
        userAgent: { type: String },
    },
    { timestamps: true }
);

activityLogSchema.index({ actorId: 1, createdAt: -1 });
activityLogSchema.index({ collectionName: 1, documentId: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });

// Enforce immutability
activityLogSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function () {
    throw new Error('ActivityLog is immutable.');
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
