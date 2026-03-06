/**
 * ShopsMart — Analytics Query Examples
 *
 * These queries target `orderItems` for fast aggregation since brand/category
 * IDs are pre-denormalized into each item document.
 *
 * Run via: require('./analytics.queries')
 */

const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const AnalyticsSnapshot = require('../models/AnalyticsSnapshot.model');

// ─────────────────────────────────────────────────────────────────────────────
// 1. PLATFORM-LEVEL: Total revenue + orders for a date range
// ─────────────────────────────────────────────────────────────────────────────
async function platformRevenueSummary(startDate, endDate) {
    return Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                orderStatus: { $ne: 'Cancelled' },
                deletedAt: null,
            },
        },
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
                avgOrderValue: { $avg: '$totalAmount' },
                totalDiscount: { $sum: '$discountAmount' },
            },
        },
    ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. BRAND PERFORMANCE: Revenue breakdown by brand
// ─────────────────────────────────────────────────────────────────────────────
async function revenueByBrand(startDate, endDate) {
    return OrderItem.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: '$brandId',
                totalItemsSold: { $sum: '$quantity' },
                totalRevenue: { $sum: '$subtotal' },
                orderCount: { $addToSet: '$orderId' },
            },
        },
        { $addFields: { orderCount: { $size: '$orderCount' } } },
        { $sort: { totalRevenue: -1 } },
        {
            $lookup: {
                from: 'brands',
                localField: '_id',
                foreignField: '_id',
                as: 'brand',
            },
        },
        { $unwind: '$brand' },
        { $project: { 'brand.name': 1, 'brand.logo': 1, totalRevenue: 1, totalItemsSold: 1, orderCount: 1 } },
    ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRODUCT PERFORMANCE: Top 10 bestselling products
// ─────────────────────────────────────────────────────────────────────────────
async function topProducts(startDate, endDate, limit = 10) {
    return OrderItem.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: '$productId',
                productName: { $first: '$name' },
                productSku: { $first: '$sku' },
                totalQtySold: { $sum: '$quantity' },
                totalRevenue: { $sum: '$subtotal' },
            },
        },
        { $sort: { totalQtySold: -1 } },
        { $limit: limit },
    ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. OUTLET ACTIVITY: Top performing outlets by revenue
// ─────────────────────────────────────────────────────────────────────────────
async function topOutlets(startDate, endDate, limit = 10) {
    return Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                orderStatus: { $ne: 'Cancelled' },
                deletedAt: null,
            },
        },
        {
            $group: {
                _id: '$outletId',
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
                avgOrderValue: { $avg: '$totalAmount' },
            },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'outlets',
                localField: '_id',
                foreignField: '_id',
                as: 'outlet',
            },
        },
        { $unwind: '$outlet' },
        { $project: { 'outlet.name': 1, 'outlet.address.city': 1, totalOrders: 1, totalRevenue: 1, avgOrderValue: 1 } },
    ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DAILY REVENUE TREND: Chart data for past N days
// ─────────────────────────────────────────────────────────────────────────────
async function dailyRevenueTrend(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return Order.aggregate([
        {
            $match: {
                createdAt: { $gte: since },
                orderStatus: { $ne: 'Cancelled' },
                deletedAt: null,
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
            },
        },
        { $sort: { _id: 1 } }, // ascending by date
    ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ORDER STATUS DISTRIBUTION
// ─────────────────────────────────────────────────────────────────────────────
async function orderStatusDistribution(startDate, endDate) {
    return Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                deletedAt: null,
            },
        },
        {
            $group: {
                _id: '$orderStatus',
                count: { $sum: 1 },
                revenue: { $sum: '$totalAmount' },
            },
        },
        { $sort: { count: -1 } },
    ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. FAST DASHBOARD READ — use pre-computed snapshots
// ─────────────────────────────────────────────────────────────────────────────
async function getDashboardSnapshot(granularity = 'daily', days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return AnalyticsSnapshot.find({
        granularity,
        scope: 'platform',
        date: { $gte: since },
    })
        .sort({ date: -1 })
        .lean();
}

module.exports = {
    platformRevenueSummary,
    revenueByBrand,
    topProducts,
    topOutlets,
    dailyRevenueTrend,
    orderStatusDistribution,
    getDashboardSnapshot,
};
