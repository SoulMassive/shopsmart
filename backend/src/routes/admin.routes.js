const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Outlet = require('../models/Outlet.model');
const Product = require('../models/Product.model');
const Brand = require('../models/Brand.model');
const Category = require('../models/Category.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// ── Brands & Categories (for dropdowns) ──────────────────────────────────────
router.get('/brands', protect, adminOnly, async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 }).select('_id name');
        res.json(brands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/categories', protect, adminOnly, async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 }).select('_id name brandId').populate('brandId', 'name');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── Products ──────────────────────────────────────────────────────────────────
// @desc  Get all products (admin view — includes images)
// @route GET /api/admin/products
router.get('/products', protect, adminOnly, async (req, res) => {
    try {
        const products = await Product.find({ deletedAt: null })
            .populate('brandId', 'name slug')
            .sort({ createdAt: -1 })
            .allowDiskUse(true);
        res.json(products);
    } catch (err) {
        console.error('[GET /admin/products]', err.message);
        res.status(500).json({ message: err.message });
    }
});

// @desc  Create a new product
// @route POST /api/admin/products
// imageData is an optional base64 data-URL string sent in JSON body
router.post('/products', protect, adminOnly, async (req, res) => {
    try {
        const { name, brandId, categoryId, description, ingredients, weight, price, stock, imageData } = req.body;

        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
        const sku = 'SKU-' + name.toUpperCase().replace(/\s+/g, '').slice(0, 6) + '-' + Date.now().toString().slice(-5);

        const images = imageData ? [imageData] : [];

        const product = await Product.create({
            name, slug, sku, brandId, categoryId, description, ingredients,
            weight: weight ? parseInt(weight) : undefined,
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            images,
            createdBy: req.user._id,
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc  Update product
// @route PATCH /api/admin/products/:id
router.patch('/products/:id', protect, adminOnly, async (req, res) => {
    try {
        const { name, price, stock, description, ingredients, isActive } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, stock, description, ingredients, isActive, updatedBy: req.user._id },
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc  Delete product (soft delete via deletedAt)
// @route DELETE /api/admin/products/:id
router.delete('/products/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { deletedAt: new Date() },
            { new: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// @desc  Get all users (admin view)
// @route GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc  Create a new user (admin only)
// @route POST /api/admin/users
router.post('/users', protect, adminOnly, async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            name,
            email,
            password,
            role,
            phone,
            createdBy: req.user._id,
        });

        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc  Get full profile for one user (incl. linked outlet)
// @route GET /api/admin/users/:id
router.get('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let outlet = null;
        if (user.outletId) {
            outlet = await Outlet.findById(user.outletId);
        }

        const location =
            outlet?.geoLocation?.coordinates?.length === 2
                ? {
                    latitude: outlet.geoLocation.coordinates[1],
                    longitude: outlet.geoLocation.coordinates[0],
                }
                : null;

        res.json({
            _id: user._id,
            fullName: user.name,
            email: user.email,
            phone: user.phone || outlet?.phone || null,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,

            // Outlet / shop data
            shopName: outlet?.name || null,
            gstNumber: outlet?.gstNumber || null,
            outletStatus: outlet?.status || null,
            address: outlet?.address || null,
            location,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
