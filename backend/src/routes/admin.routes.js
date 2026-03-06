const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Outlet = require('../models/Outlet.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');

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
