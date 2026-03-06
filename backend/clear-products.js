/**
 * Run with: node clear-products.js
 * Deletes ALL products from the database.
 */
const mongoose = require('mongoose');
require('dotenv').config();

const ProductSchema = new mongoose.Schema(
    { name: String, category: String, brand: String, price: Number, stock: Number, isActive: Boolean },
    { timestamps: true }
);
const Product = mongoose.model('Product', ProductSchema);

const run = async () => {
    console.log('🚀 Starting product cleanup...');
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!');

        const result = await Product.deleteMany({});
        console.log(`🗑️  Deleted ${result.deletedCount} products from the database.`);
        console.log('✅ Done! The products section is now empty.');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

run();
