const mongoose = require('mongoose');

const executiveLogSchema = new mongoose.Schema({
    executiveId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false 
    },
    outletId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Outlet' 
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['Traveling', 'At Outlet', 'Break', 'Completed'], 
        default: 'Traveling' 
    },
    // For legacy/bulk import compatibility
    executiveName: { type: String },
    distance: { type: Number, default: 0 },
    ordersDelivered: { type: Number, default: 0 },
    outletsVisited: { type: Number, default: 0 }
}, { timestamps: true });

// Index for geo-queries and performance
executiveLogSchema.index({ executiveId: 1, timestamp: -1 });

module.exports = mongoose.model('ExecutiveLog', executiveLogSchema);
