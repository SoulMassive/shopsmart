require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const flour = await db.collection('products').findOne({name: /Millet Flour/i});
    const ball = await db.collection('products').findOne({name: /Ragi Ball/i});
    
    console.log('Flour:', JSON.stringify(flour, null, 2));
    console.log('Ball:', JSON.stringify(ball, null, 2));
    process.exit(0);
}
test();
