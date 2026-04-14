const mongoose = require('mongoose');

const bulkRecordSchema = new mongoose.Schema(
    {
        batchId: { type: String, required: true, index: true },
        fileName: { type: String, trim: true },
        recordId: { type: String, trim: true },
        productId: { type: String, trim: true },
        productName: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        subCategory: { type: String, trim: true },
        brand: { type: String, trim: true },
        price: { type: Number, required: true, min: 0 },
        costPrice: { type: Number, min: 0 },
        quantity: { type: Number, required: true, min: 0 },
        totalValue: { type: Number, required: true },
        vendor: { type: String, trim: true },
        location: { type: String, trim: true },
        dateAdded: { type: Date, required: true },
        lastUpdated: { type: Date, default: Date.now },
        status: { 
            type: String, 
            enum: ['Active', 'Sold', 'Returned'], 
            default: 'Active' 
        },
        userId: { type: String, trim: true },
        orderId: { type: String, trim: true },
        paymentMethod: { type: String, trim: true },
        includeInReports: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        uploadedAt: { type: Date, default: Date.now }
    },
    { 
        timestamps: true,
        collection: 'bulk_records'
    }
);

// Indexes for fast reporting as requested
bulkRecordSchema.index({ category: 1 });
bulkRecordSchema.index({ dateAdded: 1 });
bulkRecordSchema.index({ status: 1 });
bulkRecordSchema.index({ productName: 'text', vendor: 'text' });

module.exports = mongoose.model('BulkRecord', bulkRecordSchema);
