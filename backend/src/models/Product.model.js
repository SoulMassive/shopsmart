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

        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
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
productSchema.index({ price: 1 }); // price range queries
productSchema.index({ tags: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // full-text search
productSchema.index({ deletedAt: 1 });

productSchema.pre(/^find/, function (next) {
    if (!this._conditions?.deletedAt) this.where({ deletedAt: null });
    next();
});

// Auto-generate slug from name
productSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
