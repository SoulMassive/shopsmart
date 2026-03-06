const mongoose = require('mongoose');

const analyticsSnapshotSchema = new mongoose.Schema(
    {
        // The snapshot date (UTC midnight of that day/week/month)
        date: { type: Date, required: true },
        granularity: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            required: true,
        },

        // 'platform' for global, 'brand' or 'outlet' for scoped
        scope: {
            type: String,
            enum: ['platform', 'brand', 'outlet'],
            required: true,
        },
        scopeId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null, // null for platform-level snapshots
        },

        // Core KPIs
        totalOrders: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
        totalItemsSold: { type: Number, default: 0 },
        avgOrderValue: { type: Number, default: 0 },
        newOutlets: { type: Number, default: 0 },

        // Order status breakdown
        ordersByStatus: {
            type: Map,
            of: Number, // { Delivered: 80, Cancelled: 5, Processing: 15 }
            default: {},
        },

        // Top performers (max 10 each — embedded, small bounded size)
        topProducts: [
            {
                productId: mongoose.Schema.Types.ObjectId,
                name: String,
                qtySold: Number,
                revenue: Number,
            },
        ],
        topOutlets: [
            {
                outletId: mongoose.Schema.Types.ObjectId,
                name: String,
                totalOrders: Number,
                revenue: Number,
            },
        ],
        topBrands: [
            {
                brandId: mongoose.Schema.Types.ObjectId,
                name: String,
                totalOrders: Number,
                revenue: Number,
            },
        ],
    },
    { timestamps: true }
);

analyticsSnapshotSchema.index({ date: -1, granularity: 1, scope: 1 });
analyticsSnapshotSchema.index({ scope: 1, scopeId: 1, date: -1 });
// Prevent duplicate snapshots for same scope/date/granularity
analyticsSnapshotSchema.index(
    { date: 1, granularity: 1, scope: 1, scopeId: 1 },
    { unique: true }
);

module.exports = mongoose.model('AnalyticsSnapshot', analyticsSnapshotSchema);
