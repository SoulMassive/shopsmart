require('dotenv').config();
const mongoose = require('mongoose');

// Define a simple schema that includes strict: false so we can read old fields
const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
const Product = mongoose.model('ProductMigration', productSchema);

async function migrate() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const products = await Product.find({});
        console.log(`Found ${products.length} total products.`);

        let updatedCount = 0;

        for (const p of products) {
            // If they have the old price but no originalPrice
            const oldPrice = p.get('price');
            const originalPrice = p.get('originalPrice');

            if (oldPrice !== undefined && originalPrice === undefined) {
                const optPrice = parseFloat(oldPrice);
                const discountPercentage = 33.33;
                const discountedPrice = Math.round(optPrice - (optPrice * discountPercentage / 100));

                await Product.updateOne(
                    { _id: p._id },
                    { 
                        $set: { 
                            originalPrice: optPrice,
                            discountPercentage: discountPercentage,
                            discountedPrice: discountedPrice
                        },
                        $unset: { price: "" }
                    }
                );
                updatedCount++;
            } else if (originalPrice !== undefined && p.get('discountedPrice') === undefined) {
                 // Has originalPrice but no discountedPrice
                 const optPrice = parseFloat(originalPrice);
                 const discountPercentage = p.get('discountPercentage') !== undefined ? parseFloat(p.get('discountPercentage')) : 33.33;
                 const discountedPrice = Math.round(optPrice - (optPrice * discountPercentage / 100));
                 
                 await Product.updateOne(
                    { _id: p._id },
                    { 
                        $set: { 
                            discountPercentage: discountPercentage,
                            discountedPrice: discountedPrice
                        }
                    }
                );
                updatedCount++;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} products.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
