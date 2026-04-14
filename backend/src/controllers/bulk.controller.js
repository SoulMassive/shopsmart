const BulkRecord = require('../models/BulkRecord.model');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const crypto = require('crypto');

// @desc    Upload bulk data (CSV/Excel)
// @route   POST /api/bulk/upload
const uploadBulkData = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const results = [];
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        
        if (fileExt === '.csv') {
            await new Promise((resolve, reject) => {
                fs.createReadStream(req.file.path)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else if (fileExt === '.xlsx' || fileExt === '.xls') {
            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);
            results.push(...data);
        } else {
            return res.status(400).json({ message: 'Only CSV and Excel files are supported' });
        }

        const batchId = `BATCH-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const fileName = req.file.originalname;
        const uploadedAt = new Date();

        // Preview logic if requested (first 10 rows)
        if (req.query.preview === 'true') {
            return res.json({ 
                preview: results.slice(0, 10), 
                totalRows: results.length,
                batchId
            });
        }

        // Processing & Validation
        const summary = { total: results.length, success: 0, failed: 0, errors: [] };
        const recordsToInsert = [];

        results.forEach((row, index) => {
            try {
                // Normalize field names (handle variations in CSV headers)
                const recordId = row.RecordID || row.recordId || row.id;
                const productId = row.ProductID || row.productId;
                const productName = row.ProductName || row.productName || row.name;
                const category = row.Category || row.category;
                const price = Number(row.Price || row.price);
                const quantity = Number(row.Quantity || row.quantity);
                const dateAdded = row.DateAdded || row.dateAdded || row.date;

                // Validation
                if (!productName || !category || isNaN(price) || isNaN(quantity) || !dateAdded) {
                    throw new Error('Missing required fields');
                }

                recordsToInsert.push({
                    batchId,
                    fileName,
                    uploadedAt,
                    recordId,
                    productId,
                    productName,
                    category,
                    subCategory: row.SubCategory || row.subCategory,
                    brand: row.Brand || row.brand,
                    price,
                    costPrice: Number(row.CostPrice || row.costPrice) || 0,
                    quantity,
                    totalValue: price * quantity, // Correct: Auto computed
                    vendor: row.Vendor || row.vendor,
                    location: row.Location || row.location,
                    dateAdded: new Date(dateAdded),
                    lastUpdated: row.LastUpdated ? new Date(row.LastUpdated) : new Date(),
                    status: row.Status || row.status || 'Active',
                    userId: row.UserID || row.userId || req.user?._id,
                    orderId: row.OrderID || row.orderId,
                    paymentMethod: row.PaymentMethod || row.paymentMethod,
                    includeInReports: true,
                    isDeleted: false
                });
                summary.success++;
            } catch (err) {
                summary.failed++;
                summary.errors.push(`Row ${index + 1}: ${err.message}`);
            }
        });

        if (recordsToInsert.length > 0) {
            await BulkRecord.insertMany(recordsToInsert);
        }

        // Cleanup
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.json({
            message: 'Bulk upload completed',
            batchId,
            summary
        });
    } catch (error) {
        console.error('[uploadBulkData error]', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// @desc    Get bulk data with filters
// @route   GET /api/bulk/data
const getBulkData = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            category, 
            status, 
            startDate, 
            endDate,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            batchId
        } = req.query;

        const query = { isDeleted: false };

        if (batchId) query.batchId = batchId;
        if (search) {
            query.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { vendor: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== 'all') query.category = category;
        if (status && status !== 'all') query.status = status;
        
        if (startDate || endDate) {
            query.dateAdded = {};
            if (startDate) query.dateAdded.$gte = new Date(startDate);
            if (endDate) query.dateAdded.$lte = new Date(endDate);
        }

        const total = await BulkRecord.countDocuments(query);
        const data = await BulkRecord.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            data,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bulk data', error: error.message });
    }
};

// @desc    Get upload history (batches)
// @route   GET /api/bulk/batches
const getBulkBatches = async (req, res) => {
    try {
        const batches = await BulkRecord.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: "$batchId",
                    fileName: { $first: "$fileName" },
                    uploadedAt: { $first: "$uploadedAt" },
                    recordCount: { $sum: 1 },
                    totalValue: { $sum: "$totalValue" },
                    includeInReports: { $first: "$includeInReports" }
                }
            },
            { $sort: { uploadedAt: -1 } }
        ]);
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching batches', error: error.message });
    }
};

// @desc    Delete a bulk batch (soft delete)
// @route   DELETE /api/bulk/batch/:batchId
const deleteBulkBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        await BulkRecord.updateMany({ batchId }, { isDeleted: true });
        res.json({ message: `Batch ${batchId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting batch', error: error.message });
    }
};

// @desc    Toggle batch in reports
// @route   PATCH /api/bulk/batch/:batchId/toggle-report
const toggleBatchReport = async (req, res) => {
    try {
        const { batchId } = req.params;
        const record = await BulkRecord.findOne({ batchId });
        if (!record) return res.status(404).json({ message: 'Batch not found' });

        await BulkRecord.updateMany({ batchId }, { includeInReports: !record.includeInReports });
        res.json({ message: `Reporting toggled for batch ${batchId}` });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling report', error: error.message });
    }
};

// @desc    Get filter options
// @route   GET /api/bulk/filters
const getBulkFilters = async (req, res) => {
    try {
        const query = { isDeleted: false };
        const categories = await BulkRecord.distinct('category', query);
        const statuses = await BulkRecord.distinct('status', query);
        const vendors = await BulkRecord.distinct('vendor', query);

        res.json({ categories, statuses, vendors });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching filters', error: error.message });
    }
};

// @desc    Get reporting data
// @route   GET /api/bulk/reports
const getBulkReports = async (req, res) => {
    try {
        const match = { isDeleted: false, includeInReports: true };

        const stats = await BulkRecord.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalValue" },
                    totalOrders: { $count: {} },
                    avgPrice: { $avg: "$price" }
                }
            }
        ]);

        const categoryStats = await BulkRecord.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$category",
                    sales: { $sum: "$totalValue" },
                    count: { $count: {} }
                }
            },
            { $sort: { sales: -1 } }
        ]);

        const vendorRevenue = await BulkRecord.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$vendor",
                    revenue: { $sum: "$totalValue" }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        const paymentMethodStats = await BulkRecord.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$paymentMethod",
                    count: { $count: {} }
                }
            }
        ]);

        const salesOverTime = await BulkRecord.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateAdded" } },
                    sales: { $sum: "$totalValue" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            overview: stats[0] || { totalSales: 0, totalOrders: 0, avgPrice: 0 },
            categoryStats,
            vendorRevenue,
            paymentMethodStats,
            salesOverTime
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating reports', error: error.message });
    }
};

// @desc    Export bulk data to CSV
// @route   GET /api/bulk/export
const exportBulkData = async (req, res) => {
    try {
        const { search, category, status, batchId } = req.query;
        const query = { isDeleted: false };

        if (batchId) query.batchId = batchId;
        if (search) {
            query.$or = [
                { productName: { $regex: search, $options: 'i' } },
                { vendor: { $regex: search, $options: 'i' } }
            ];
        }
        if (category && category !== 'all') query.category = category;
        if (status && status !== 'all') query.status = status;

        const records = await BulkRecord.find(query).sort({ createdAt: -1 });

        // Generate CSV
        const headers = ["BatchID", "RecordID", "ProductID", "ProductName", "Category", "Price", "Quantity", "TotalValue", "Vendor", "Location", "DateAdded", "Status"];
        const rows = records.map(r => [
            r.batchId,
            r.recordId,
            r.productId,
            r.productName,
            r.category,
            r.price,
            r.quantity,
            r.totalValue,
            r.vendor,
            r.location,
            r.dateAdded.toISOString(),
            r.status
        ]);

        const csvContent = headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=bulk_export.csv');
        res.status(200).send(csvContent);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting data', error: error.message });
    }
};

module.exports = {
    uploadBulkData,
    getBulkData,
    getBulkFilters,
    getBulkReports,
    exportBulkData,
    getBulkBatches,
    deleteBulkBatch,
    toggleBatchReport
};
