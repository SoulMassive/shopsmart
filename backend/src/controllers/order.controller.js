const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, outletId } = req.body;
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        const user = await User.findById(userId);

        // Track totals
        let subtotal = 0;
        let totalWeightKg = 0;
        let itemCount = 0;

        const orderItemsToCreate = [];

        // Fetch prices securely from backend
        for (const item of items) {
            const product = await Product.findById(item.productId).populate('brandId');
            if (!product) continue;

            // Use item.quantity or default to 1
            const qty = item.quantity || 1;
            itemCount += qty;

            const itemSubtotal = product.discountedPrice * qty;
            subtotal += itemSubtotal;

            // Calculate weight (support both weightInKg or weight in grams)
            const itemWeightKg = (product.weightInKg || (product.weight / 1000) || 0);
            totalWeightKg += itemWeightKg * qty;

            orderItemsToCreate.push({
                productId: product._id,
                brandId: product.brandId?._id || product.brandId,
                categoryId: product.categoryId,
                brandName: product.brandId?.name || '',
                weightInKg: itemWeightKg,
                name: product.name,
                sku: product.sku,
                image: product.images?.[0] || '',
                unitPrice: product.discountedPrice,
                unit: product.unit,
                quantity: qty,
                subtotal: itemSubtotal,
            });
        }

        if (orderItemsToCreate.length === 0) {
            return res.status(400).json({ message: 'No valid products in order' });
        }

        // Apply 50% Discount Rules
        let discountAmount = 0;
        let discountType = null;
        if (!user.hasUsedFirstOrderOffer && totalWeightKg >= 15) {
            discountAmount = Math.round(subtotal * 0.5); // 50% OFF
            discountType = 'FIRST_ORDER';
        }

        const taxAmount = 0; // Or calculate tax
        const shippingCost = 0; // Or calculate shipping
        const totalAmount = subtotal - discountAmount + taxAmount + shippingCost;

        // Generate Order Number
        const orderNumber = await Order.generateOrderNumber();

        // Save order wrapper
        const order = new Order({
            orderNumber,
            userId,
            outletId: outletId || user.outletId || userId, // Fallback if no outlet
            shippingAddress: shippingAddress || { street: 'Main St', city: 'City', state: 'State', zipCode: '000000' }, // Fallback for demo
            itemCount,
            subtotal,
            discountAmount,
            discountType,
            taxAmount,
            shippingCost,
            totalAmount,
            paymentMethod: paymentMethod || 'COD',
            orderStatus: 'Confirmed',
        });

        // Save items with OrderId
        const savedOrderItems = await Promise.all(
            orderItemsToCreate.map(async (oi) => {
                const doc = new OrderItem({ ...oi, orderId: order._id });
                await doc.save();
                return doc._id;
            })
        );

        order.items = savedOrderItems;
        await order.save();

        // If discount used, mark user as having used it
        if (discountType === 'FIRST_ORDER') {
            user.hasUsedFirstOrderOffer = true;
            await user.save();
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate('items')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
