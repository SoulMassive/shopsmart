const express = require('express');
const router = express.Router();
const Outlet = require('../models/Outlet.model');
const User = require('../models/User.model');
const { protect } = require('../middleware/auth.middleware');

// @desc  Get the outlet linked to the currently logged-in retail user
// @route GET /api/outlets/mine
router.get('/mine', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user?.outletId) {
            return res.status(404).json({ message: 'No outlet linked to this account.' });
        }
        const outlet = await Outlet.findById(user.outletId);
        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found.' });
        }
        res.json(outlet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc  Update an outlet's details
// @route PATCH /api/outlets/:id
router.patch('/:id', protect, async (req, res) => {
    try {
        const { name, phone, gstNumber, address } = req.body;

        // Only allow owners to update their own outlet
        const user = await User.findById(req.user.id);
        if (user?.outletId?.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorised to update this outlet.' });
        }

        const outlet = await Outlet.findByIdAndUpdate(
            req.params.id,
            { name, phone, gstNumber: gstNumber || undefined, address, updatedBy: req.user.id },
            { new: true, runValidators: true }
        );
        res.json(outlet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc  Get outlets assigned to the field executive
// @route GET /api/outlets/executive
router.get('/executive', protect, async (req, res) => {
    try {
        const outlets = await Outlet.find({ executiveId: req.user._id });
        res.json(outlets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
