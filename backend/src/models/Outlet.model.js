const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Outlet name is required'],
            trim: true,
        },
        ownerUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        executiveId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        gstNumber: {
            type: String,
            trim: true,
            uppercase: true,
            match: [
                /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
                'Invalid GSTIN format',
            ],
            sparse: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            match: [/^[6-9]\d{9}$/, 'Please enter a valid phone number'],
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
        },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: {
                type: String,
                required: true,
                match: [/^\d{6}$/, 'Zip code must be 6 digits'],
            },
            country: { type: String, default: 'India' },
        },
        geoLocation: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'suspended'],
            default: 'pending',
        },
        creditLimit: { type: Number, default: 0, min: 0 },
        outstandingBalance: { type: Number, default: 0 },

        // Denormalized counters – updated via atomic $inc on each order
        totalOrders: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },

        // Soft delete & audit
        deletedAt: { type: Date, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// Note: gstNumber index is created automatically by unique/sparse on the field.
outletSchema.index({ ownerUserId: 1 });
outletSchema.index({ executiveId: 1 });
outletSchema.index({ status: 1 });
outletSchema.index({ geoLocation: '2dsphere' });
outletSchema.index({ 'address.city': 1, 'address.state': 1 });
outletSchema.index({ deletedAt: 1 });

outletSchema.pre(/^find/, function (next) {
    if (!this._conditions.deletedAt) this.where({ deletedAt: null });
    next();
});

module.exports = mongoose.model('Outlet', outletSchema);
