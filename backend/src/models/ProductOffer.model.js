const mongoose = require('mongoose');

const productOfferSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: true,
        },
        title: { type: String, required: true, trim: true },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: [0, 'Discount cannot be negative'],
        },
        minQuantity: { type: Number, default: 1, min: 1 },
        maxUsagePerOutlet: { type: Number, default: null }, // null = unlimited
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },

        deletedAt: { type: Date, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

productOfferSchema.index({ productId: 1, isActive: 1 });
productOfferSchema.index({ brandId: 1 });
productOfferSchema.index({ startDate: 1, endDate: 1 });

// Validate percentage doesn't exceed 100
productOfferSchema.pre('save', function (next) {
    if (this.discountType === 'percentage' && this.discountValue > 100) {
        return next(new Error('Percentage discount cannot exceed 100%'));
    }
    next();
});

module.exports = mongoose.model('ProductOffer', productOfferSchema);
