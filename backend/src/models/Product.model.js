const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: { type: String, trim: true },
        ingredients: { type: String, trim: true },
        storageConditions: { type: String, trim: true },
        healthBenefits: { type: String, trim: true },

        // Now proper ObjectId references — replaces hardcoded strings
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: [true, 'Brand is required'],
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },

        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        barcode: { type: String, trim: true },

        originalPrice: {
            type: Number,
            required: [true, 'Original Price is required'],
            min: [0, 'Original Price cannot be negative'],
        },
        discountPercentage: {
            type: Number,
            default: 33.33,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%']
        },
        discountedPrice: {
            type: Number,
            min: [0, 'Discounted Price cannot be negative'],
        },
        // Hidden from API responses by default — internal use only
        costPrice: { type: Number, min: 0, select: false },

        stock: { type: Number, default: 0, min: 0 },
        unit: {
            type: String,
            enum: ['kg', 'litre', 'piece', 'bag', 'box', 'pack'],
            default: 'piece',
        },
        weight: { type: Number, min: 0 }, // in grams
        weightInKg: { type: Number, min: 0 }, // specifically for the 15kg threshold

        images: [{ type: String }], // CDN URLs
        tags: [{ type: String, lowercase: true }], // for search / filtering

        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },

        // Denormalized analytics counters — updated atomically on order
        totalSold: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },

        // Soft delete & audit
        deletedAt: { type: Date, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// Note: slug index is created automatically by unique: true
productSchema.index({ brandId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ createdAt: -1 }); // Prevents "Sort exceeded memory limit" when fetching products
productSchema.index({ totalSold: -1 }); // bestsellers
productSchema.index({ discountedPrice: 1 }); // price range queries
productSchema.index({ tags: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // full-text search
productSchema.index({ deletedAt: 1 });

productSchema.pre(/^find/, function (next) {
    if (!this._conditions?.deletedAt) this.where({ deletedAt: null });
    next();
});

// Auto-generate slug from name and auto-calculate discount
productSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }

    // Auto-calculate discountedPrice if originalPrice or discountPercentage is modified
    if (this.isModified('originalPrice') || this.isModified('discountPercentage')) {
        const discount = this.discountPercentage !== undefined ? this.discountPercentage : 33.33;
        this.discountedPrice = Math.round(this.originalPrice - (this.originalPrice * discount / 100));
    }
    
    next();
});

productSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.originalPrice !== undefined || update.discountPercentage !== undefined) {
        // If either is updated, we need to calculate. If one is missing from update payload, we might need to fetch the doc or assume it's set. 
        // For simplicity, we can calculate it in the route handler before update, OR do it here if we have both.
        // It's safer to just let the route controller pass discountedPrice or enforce both are updated.
        // Or we can use an aggregation pipeline for update, but simpler to compute in controller for findOneAndUpdate.
        // Let's just calculate it if both are provided or if originalPrice is provided.
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
