const mongoose = require('mongoose');

const BulkOrderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: String, required: true },
    requirements: { type: String },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], default: 'Pending' },
    contacted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('BulkOrder', BulkOrderSchema);
