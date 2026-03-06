/**
 * Run with: node wipe-products.js
 * Uses existing project models to ensure correct database interaction.
 */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Load the Product model directly from the source to avoid any mismatch
const Product = require('./src/models/Product.model.js');
const connectDB = require('./src/config/db.js');

const run = async () => {
    console.log('🚀 Starting robust product wipe...');
    try {
        await connectDB();

        const countBefore = await Product.countDocuments({});
        console.log(`📊 Current product count: ${countBefore}`);

        const result = await Product.deleteMany({});
        console.log(`🗑️  Successfully deleted ${result.deletedCount} products.`);

        const countAfter = await Product.countDocuments({});
        console.log(`📊 New product count: ${countAfter}`);

        await mongoose.connection.close();
        console.log('✅ Database connection closed.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Wipe failed:', err.message);
        process.exit(1);
    }
};

// Force exit if hanging
setTimeout(() => {
    console.error('⚠️  Operation timed out after 30 seconds.');
    process.exit(1);
}, 30000);

run();
