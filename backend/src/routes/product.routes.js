const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    importProducts,
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Multer config for CSV uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Bulk Import
router.post('/import', protect, adminOnly, upload.single('file'), importProducts);

module.exports = router;
