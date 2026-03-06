const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User.model');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// @desc  Update own name / basic info
// @route PATCH /api/auth/me
router.patch('/me', protect, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, updatedBy: req.user.id },
            { new: true, runValidators: true }
        );
        res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
