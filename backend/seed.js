/**
 * ShopsMart Database Seed Script
 * 
 * Run with: node seed.js
 * Make sure your backend/.env has MONGODB_URI set before running.
 */

const mongoose = require('mongoose');
require('dotenv').config();

// ─── Models ────────────────────────────────────────────────────────────────
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    { name: String, email: { type: String, unique: true }, password: String, role: String, isActive: Boolean },
    { timestamps: true }
);
const User = mongoose.model('User', UserSchema);
const ProductSchema = new mongoose.Schema(
    { name: String, category: String, brand: String, price: Number, stock: Number, isActive: Boolean },
    { timestamps: true }
);
const Product = mongoose.model('Product', ProductSchema);

// ─── Seed Data ─────────────────────────────────────────────────────────────

const users = [
    {
        name: 'Admin One',
        email: 'admin1@shopsmart.com',
        password: 'Admin@1234',
        role: 'admin',
        isActive: true,
    },
    {
        name: 'Admin Two',
        email: 'admin2@shopsmart.com',
        password: 'Admin@5678',
        role: 'admin',
        isActive: true,
    },
    {
        name: 'Retail Store 1',
        email: 'store1@shopsmart.com',
        password: 'Store@123',
        role: 'user',
        isActive: true,
    },
    {
        name: 'Retail Store 2',
        email: 'store2@shopsmart.com',
        password: 'Store@123',
        role: 'user',
        isActive: true,
    },
];



// ─── Main Seeder ───────────────────────────────────────────────────────────
const seed = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});

        // Seed users with hashed passwords
        console.log('👤 Seeding users...');
        const hashedUsers = await Promise.all(
            users.map(async (u) => ({
                ...u,
                password: await bcrypt.hash(u.password, 12),
            }))
        );
        await User.insertMany(hashedUsers);
        console.log(`   ✅ ${hashedUsers.length} users created`);

        console.log('\n🎉 Database seeded successfully!\n');
        console.log('Login credentials:');
        console.log('  Admin 1 → admin1@shopsmart.com / Admin@1234');
        console.log('  Admin 2 → admin2@shopsmart.com / Admin@5678');
        console.log('  Store 1 → store1@shopsmart.com / Store@123');
        console.log('  Store 2 → store2@shopsmart.com / Store@123');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seed();
