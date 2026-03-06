const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        event: {
            type: String,
            enum: [
                'PASSWORD_CHANGED',
                'PASSWORD_RESET_REQUESTED',
                'ROLE_CHANGED',
                'ACCOUNT_LOCKED',
                'ACCOUNT_UNLOCKED',
                'TWO_FACTOR_ENABLED',
                'TWO_FACTOR_DISABLED',
                'SUSPICIOUS_LOGIN',
                'TOKEN_REVOKED',
            ],
            required: true,
        },
        ipAddress: { type: String },
        userAgent: { type: String },
        metadata: { type: mongoose.Schema.Types.Mixed }, // e.g. { oldRole, newRole }
    },
    { timestamps: true }
);

securityLogSchema.index({ userId: 1, createdAt: -1 });
securityLogSchema.index({ event: 1 });
securityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SecurityLog', securityLogSchema);
