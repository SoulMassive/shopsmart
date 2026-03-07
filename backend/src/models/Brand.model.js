const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Brand name is required'],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        logo: { type: String }, // CDN URL
        description: { type: String, trim: true },
        contactEmail: {
            type: String,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
        },
        isActive: { type: Boolean, default: true },
        deletedAt: { type: Date, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

brandSchema.index({ slug: 1 }, { unique: true });
brandSchema.index({ isActive: 1 });
brandSchema.pre(/^find/, function (next) {
    if (!this._conditions?.deletedAt) this.where({ deletedAt: null });
    next();
});

// Auto-generate slug from name before saving
brandSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('Brand', brandSchema);
