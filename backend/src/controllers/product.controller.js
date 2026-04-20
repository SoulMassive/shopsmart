const Product = require('../models/Product.model');
const Brand = require('../models/Brand.model');
const Category = require('../models/Category.model');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

// @desc    Get all products (with optional search & brand/category filter)
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;

        // Explicit filters — don't depend on pre-find hooks
        const query = { isActive: true, deletedAt: null };

        if (category) {
            // Find brand by name or slug (case-insensitive)
            const brand = await Brand.findOne({ 
                $or: [
                    { name: { $regex: new RegExp(`^${category}$`, 'i') } },
                    { slug: category.toLowerCase() }
                ],
                deletedAt: null 
            });
            
            if (brand) {
                query.brandId = brand._id;
            } else {
                return res.json({ products: [], total: 0, page: Number(page), pages: 0 });
            }
        }

        if (search) query.name = { $regex: search, $options: 'i' };

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('brandId', 'name slug')
            .populate('categoryId', 'name slug')
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });
            // .allowDiskUse(true); // Removed as it can cause crashes in some Mongo/Mongoose versions

        res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('[getProducts error]', {
            message: error.message,
            stack: error.stack,
            query: req.query
        });
        res.status(500).json({ 
            message: 'Internal Server Error while fetching products',
            details: error.message 
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Import products from CSV (admin)
// @route   POST /api/products/import
const importProducts = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const results = [];
    const summary = { created: 0, updated: 0, errors: [] };

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            for (const [index, row] of results.entries()) {
                try {
                    const productId = row['Product ID'] || row['productId'];
                    const name = row['Name'] || row['name'];
                    const brandName = row['Brand'] || row['brand'];
                    const categoryName = row['Category'] || row['category'];
                    const price = row['Price'] || row['price'];
                    const stock = row['Stock'] || row['stock'];
                    const unit = row['Unit'] || row['unit'];

                    if (!name || !brandName || !price) {
                        throw new Error('Missing required fields: Name, Brand, or Price');
                    }

                    // Lookup Brand
                    let brand = await Brand.findOne({ name: new RegExp(`^${brandName.trim()}$`, 'i') });
                    if (!brand) throw new Error(`Brand not found: ${brandName}`);

                    // Lookup Category
                    let categoryId = null;
                    if (categoryName) {
                        const category = await Category.findOne({ name: new RegExp(`^${categoryName.trim()}$`, 'i') });
                        if (category) categoryId = category._id;
                    }

                    const productData = {
                        name: name.trim(),
                        brandId: brand._id,
                        categoryId,
                        originalPrice: Number(price),
                        stock: Number(stock) || 0,
                        unit: (unit || 'piece').trim().toLowerCase(),
                        isActive: true
                    };

                    if (productId && mongoose.Types.ObjectId.isValid(productId)) {
                        const updated = await Product.findByIdAndUpdate(productId, productData, { new: true });
                        if (updated) {
                            summary.updated++;
                        } else {
                            // If ID provided but not found, create new (ignoring that ID)
                            await Product.create(productData);
                            summary.created++;
                        }
                    } else {
                        await Product.create(productData);
                        summary.created++;
                    }
                } catch (err) {
                    summary.errors.push(`Row ${index + 1}: ${err.message}`);
                }
            }
            
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            res.json(summary);
        })
        .on('error', (err) => {
            res.status(500).json({ message: 'Error processing CSV', error: err.message });
        });
};

module.exports = { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    importProducts
};
