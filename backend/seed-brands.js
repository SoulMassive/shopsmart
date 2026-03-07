/**
 * Seed Brands & Categories for ShopsMart
 * Run: node seed-brands.js   (from the backend/ folder)
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Brand = require('./src/models/Brand.model');
const Category = require('./src/models/Category.model');

const seed = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!');

        // ── Brands ────────────────────────────────────────────────────────────
        const brandDefs = [
            { name: 'SSR', slug: 'ssr', description: 'SSR brand products' },
            { name: 'JayaJanardhana', slug: 'jayajanardhana', description: 'JayaJanardhana (JJR) brand products' },
            { name: 'MilletsPro', slug: 'milletspro', description: 'MilletsPro brand products' },
        ];

        console.log('\n🏷️  Seeding brands...');

        const brandMap = {}; // slug → _id

        for (const def of brandDefs) {
            const existing = await Brand.findOne({ slug: def.slug });
            if (existing) {
                console.log(`   ⏭️  Brand "${def.name}" already exists — skipping`);
                brandMap[def.slug] = existing._id;
            } else {
                const brand = await Brand.create(def);
                brandMap[def.slug] = brand._id;
                console.log(`   ✅  Created brand "${def.name}"`);
            }
        }

        // ── Categories ────────────────────────────────────────────────────────
        // Each brand gets a set of relevant product categories
        const categoryDefs = [
            // SSR
            { name: 'Rice Varieties', slug: 'ssr-rice-varieties', brandSlug: 'ssr' },
            { name: 'Pulses & Lentils', slug: 'ssr-pulses-lentils', brandSlug: 'ssr' },
            { name: 'Spices & Masalas', slug: 'ssr-spices-masalas', brandSlug: 'ssr' },
            { name: 'Cooking Oils', slug: 'ssr-cooking-oils', brandSlug: 'ssr' },

            // JayaJanardhana (JJR)
            { name: 'Flour & Grains', slug: 'jjr-flour-grains', brandSlug: 'jayajanardhana' },
            { name: 'Packaged Foods', slug: 'jjr-packaged-foods', brandSlug: 'jayajanardhana' },
            { name: 'Health Products', slug: 'jjr-health-products', brandSlug: 'jayajanardhana' },

            // MilletsPro
            { name: 'Millet Flour', slug: 'mp-millet-flour', brandSlug: 'milletspro' },
            { name: 'Millet Snacks', slug: 'mp-millet-snacks', brandSlug: 'milletspro' },
            { name: 'Organic Grains', slug: 'mp-organic-grains', brandSlug: 'milletspro' },
            { name: 'Health Mixes', slug: 'mp-health-mixes', brandSlug: 'milletspro' },
        ];

        console.log('\n📂 Seeding categories...');

        for (const def of categoryDefs) {
            const brandId = brandMap[def.brandSlug];
            const existing = await Category.findOne({ slug: def.slug });
            if (existing) {
                console.log(`   ⏭️  Category "${def.name}" already exists — skipping`);
            } else {
                await Category.create({ name: def.name, slug: def.slug, brandId });
                console.log(`   ✅  Created category "${def.name}" under ${def.brandSlug}`);
            }
        }

        console.log('\n🎉 Brands & Categories seeded successfully!\n');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seed();
