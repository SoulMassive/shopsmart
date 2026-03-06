const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Outlet = require('../models/Outlet.model');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc    Register a new user (and optionally create their Outlet record)
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, phone, shopName, gstNumber, address, location } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create the user account
        const user = await User.create({
            name,
            email,
            password,
            phone: phone || undefined,
            role: 'retailOutlet',
        });

        // If shop details were provided, create the Outlet record too
        if (shopName && address) {
            const [city = '', state = ''] = (address.cityState || '').split(',').map((s) => s.trim());

            const outletData = {
                name: shopName,
                ownerUserId: user._id,
                phone: phone || '0000000000',
                gstNumber: gstNumber || undefined,
                address: {
                    street: address.street || '',
                    city: city,
                    state: state,
                    zipCode: (address.zipCode || '').replace(/\D/g, '').padStart(6, '0').slice(0, 6),
                    country: 'India',
                },
            };

            // Attach GeoJSON coordinates if the user detected their location
            if (location && location.coordinates && location.coordinates.length === 2) {
                const [lng, lat] = location.coordinates;
                // Sanity validation: lng [-180, 180], lat [-90, 90]
                if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
                    outletData.geoLocation = {
                        type: 'Point',
                        coordinates: [lng, lat],
                    };
                }
            }

            const outlet = await Outlet.create(outletData);
            // Link the outlet back to the user
            await User.findByIdAndUpdate(user._id, { outletId: outlet._id });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getMe };
