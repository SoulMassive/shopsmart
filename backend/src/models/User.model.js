const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
            set: v => v === "" ? undefined : v,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['admin', 'executive', 'retailOutlet'],
            required: true,
            default: 'retailOutlet',
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
        },
        avatar: { type: String }, // CDN URL

        // Only populated for retailOutlet role
        outletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet', default: null },

        // Only populated for executive role
        assignedRegion: { type: String, trim: true },

        isActive: { type: Boolean, default: true },
        deletedAt: { type: Date, default: null },
        hasUsedFirstOrderOffer: { type: Boolean, default: false },

        // Session / security
        lastLoginAt: { type: Date },
        passwordChangedAt: { type: Date },
        passwordResetToken: { type: String, select: false },
        passwordResetExpires: { type: Date, select: false },
        twoFactorEnabled: { type: Boolean, default: false },

        // Audit
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    { timestamps: true }
);

// ── Indexes ─────────────────────────────────────────────────────────────────
// Note: email index is created automatically by unique: true on the field.
userSchema.index({ role: 1 });
userSchema.index({ outletId: 1 });
userSchema.index({ assignedRegion: 1 });
userSchema.index({ deletedAt: 1, isActive: 1 });

// ── Middleware ───────────────────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    if (!this.isNew) this.passwordChangedAt = new Date();
    next();
});

// Soft-delete: exclude deleted users by default
userSchema.pre(/^find/, function (next) {
    if (!this._conditions?.deletedAt) this.where({ deletedAt: null });
    next();
});

// ── Methods ──────────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

module.exports = mongoose.model('User', userSchema);
