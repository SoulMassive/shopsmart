const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const ExecutiveLog = require('../models/ExecutiveLog.model');
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

const upload = multer({ dest: 'uploads/csv/' });

// @desc  Upload CSV data (Executive logs)
// @route POST /api/admin/analytics/upload-csv
router.post('/upload-csv', protect, adminOnly, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            // Map CSV to schema
            results.push({
                executiveName: data.executive_name,
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
                timestamp: new Date(data.timestamp),
                distance: parseFloat(data.distance) || 0,
                ordersDelivered: parseInt(data.orders_delivered) || parseInt(data.ordersDelivered) || 0,
                outletsVisited: parseInt(data.outlets_visited) || parseInt(data.outletsVisited) || 0
            });
        })
        .on('end', async () => {
            try {
                // Bulk insert the logs
                if (results.length > 0) {
                    await ExecutiveLog.insertMany(results);
                }

                // Cleanup temp file
                fs.unlinkSync(req.file.path);

                res.status(200).json({ message: `Successfully imported ${results.length} records.`, count: results.length });
            } catch (err) {
                console.error(err);
                fs.unlinkSync(req.file.path);
                res.status(500).json({ message: 'Error saving CSV to database', error: err.message });
            }
        });
});

// @desc  Get Executive Map Data & Charts
// @route GET /api/admin/analytics/executives
router.get('/executives', protect, adminOnly, async (req, res) => {
    try {
        const logs = await ExecutiveLog.find().sort({ timestamp: -1 });

        // Aggregate by executive
        const byExecutive = {};
        logs.forEach(log => {
            if (!byExecutive[log.executiveName]) {
                byExecutive[log.executiveName] = {
                    name: log.executiveName,
                    distance: 0,
                    orders: 0,
                    outlets: 0,
                    route: [],
                    lastLocation: null,
                    lastUpdate: null
                };
            }
            const exec = byExecutive[log.executiveName];
            exec.distance += log.distance;
            exec.orders += log.ordersDelivered;
            exec.outlets += log.outletsVisited;
            // First log encountered is the most recent because of sort
            if (!exec.lastLocation) {
                exec.lastLocation = [log.latitude, log.longitude];
                exec.lastUpdate = log.timestamp;
            }
            exec.route.push([log.latitude, log.longitude]);
        });

        // Reverse route to be chronological (start to end)
        Object.values(byExecutive).forEach(e => e.route.reverse());

        res.json({ logs, executives: Object.values(byExecutive) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc  Get Overview KPI Stats
// @route GET /api/admin/analytics/overview
router.get('/overview', protect, adminOnly, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const invoices = await Order.countDocuments({ status: { $in: ['Delivered', 'Proforma Generated'] } });
        const orders = await Order.find();

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const activeExecutives = await User.countDocuments({ role: 'field_executive' });
        const retailOutlets = await User.countDocuments({ role: 'retail_outlet' });
        const totalProducts = await Product.countDocuments({ deletedAt: null });

        const formatMoney = (val) => {
            if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
            return `₹${val.toLocaleString()}`;
        };

        res.json({
            revenue: formatMoney(totalRevenue),
            orders: totalOrders.toLocaleString(),
            invoices: invoices.toLocaleString(),
            executives: activeExecutives.toString(),
            outlets: retailOutlets.toString(),
            products: totalProducts.toString()
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc  Get Revenue & Sales Analytics
// @route GET /api/admin/analytics/revenue
router.get('/revenue', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product');

        // Revenue by month
        const monthlyRevenue = {};
        // Orders per day
        const dailyOrders = {};
        // Revenue by brand
        const brandRevenue = {};

        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthStr = date.toLocaleString('default', { month: 'short' });
            const dayStr = date.toISOString().split('T')[0];

            if (!monthlyRevenue[monthStr]) monthlyRevenue[monthStr] = 0;
            monthlyRevenue[monthStr] += order.totalAmount || 0;

            if (!dailyOrders[dayStr]) dailyOrders[dayStr] = 0;
            dailyOrders[dayStr] += 1;

            // Brand calculations
            order.items.forEach(item => {
                if (item.product && item.product.brand) {
                    const brand = item.product.brand;
                    if (!brandRevenue[brand]) brandRevenue[brand] = 0;
                    brandRevenue[brand] += (item.price * item.quantity);
                }
            });
        });

        const monthlyData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));
        const dailyData = Object.entries(dailyOrders).map(([date, orders]) => ({ date, orders }));
        const brandData = Object.entries(brandRevenue).map(([brand, revenue]) => ({ name: brand, value: revenue }));

        res.json({
            monthlyRevenue: monthlyData,
            dailyOrders: dailyData.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14), // last 14 days
            brandRevenue: brandData
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc  Get Product Analytics
// @route GET /api/admin/analytics/products
router.get('/products', protect, adminOnly, async (req, res) => {
    try {
        const products = await Product.find({ deletedAt: null });
        const orders = await Order.find().populate('items.product');

        const productSales = {};
        const categorySales = {};

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.product) {
                    // product vs units sold
                    const pName = item.product.name;
                    if (!productSales[pName]) productSales[pName] = 0;
                    productSales[pName] += item.quantity;

                    // category distribution
                    const cat = item.product.category || 'Uncategorized';
                    if (!categorySales[cat]) categorySales[cat] = 0;
                    categorySales[cat] += item.quantity;
                }
            });
        });

        const topProducts = Object.entries(productSales)
            .map(([name, units]) => ({ name, units }))
            .sort((a, b) => b.units - a.units)
            .slice(0, 10);

        const categoryData = Object.entries(categorySales).map(([name, value]) => ({ name, value }));

        const lowStock = products
            .filter(p => p.stock < 50)
            .map(p => ({
                id: p._id,
                name: p.name,
                stock: p.stock,
                category: p.category
            }))
            .sort((a, b) => a.stock - b.stock)
            .slice(0, 10);

        res.json({
            topProducts,
            categoryDistribution: categoryData,
            lowStock
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
