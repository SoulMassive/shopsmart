const Product = require('../models/Product.model');
const Brand = require('../models/Brand.model');

// @desc    Get all products (with optional search & brand/category filter)
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;

        // Explicit filters — don't depend on pre-find hooks
        const query = { isActive: true, deletedAt: null };

        if (category) {
            const brand = await Brand.findOne({ name: category, deletedAt: null });
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

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
