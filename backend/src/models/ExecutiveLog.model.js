const mongoose = require('mongoose');

const executiveLogSchema = new mongoose.Schema({
    executiveName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    distance: { type: Number, required: true },
    ordersDelivered: { type: Number, default: 0 },
    outletsVisited: { type: Number, default: 0 }
});

module.exports = mongoose.model('ExecutiveLog', executiveLogSchema);
