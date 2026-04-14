const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    uploadBulkData,
    getBulkData,
    getBulkFilters,
    getBulkReports,
    exportBulkData,
    getBulkBatches,
    deleteBulkBatch,
    toggleBatchReport
} = require('../controllers/bulk.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Multer config for bulk file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `bulk-${Date.now()}${ext}`);
    },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit as requested
});

// All bulk routes are protected and admin only
router.use(protect);
router.use(adminOnly);

router.post('/upload', upload.single('file'), uploadBulkData);
router.get('/data', getBulkData);
router.get('/batches', getBulkBatches);
router.delete('/batch/:batchId', deleteBulkBatch);
router.patch('/batch/:batchId/toggle-report', toggleBatchReport);
router.get('/filters', getBulkFilters);
router.get('/reports', getBulkReports);
router.get('/export', exportBulkData);

module.exports = router;
