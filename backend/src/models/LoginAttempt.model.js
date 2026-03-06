const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema(
    {
        email: { type: String, lowercase: true, required: true },
        ipAddress: { type: String, required: true },
        success: { type: Boolean, required: true },
        failureReason: {
            type: String,
            enum: ['wrong_password', 'user_not_found', 'account_locked', 'account_inactive', null],
            default: null,
        },
        userAgent: { type: String },
    },
    { timestamps: true }
);

loginAttemptSchema.index({ email: 1, createdAt: -1 });
loginAttemptSchema.index({ ipAddress: 1, createdAt: -1 });
// TTL: auto-delete login attempts after 30 days
loginAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2_592_000 });

/**
 * Static helper: check if an account is locked due to too many failures
 * Locks after 5 failed attempts within 15 minutes.
 */
loginAttemptSchema.statics.isLocked = async function (email) {
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;
    const since = new Date(Date.now() - windowMs);

    const failCount = await this.countDocuments({
        email,
        success: false,
        createdAt: { $gte: since },
    });
    return failCount >= maxAttempts;
};

module.exports = mongoose.model('LoginAttempt', loginAttemptSchema);
