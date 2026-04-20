require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://shopsmart-hazel.vercel.app',
    process.env.CLIENT_URL,
].filter(Boolean).map(o => o.replace(/\/$/, ''));

const isAllowedDevLanOrigin = (origin) => {
    if (process.env.NODE_ENV === 'production') return false;
    // Allow local network frontend URLs in development, e.g. http://192.168.x.x:8080
    return /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?$/i.test(origin);
};

// CORS configuration
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : '';

    if (!origin || allowedOrigins.includes(normalizedOrigin) || isAllowedDevLanOrigin(origin)) {
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type,Authorization,X-Requested-With,Accept'
        );

        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }
        next();
    } else {
        console.error(`[CORS] Rejected: ${origin}`);
        res.status(403).json({ message: 'CORS policy blocked this request' });
    }
});
// ─────────────────────────────────────────────────────────────────────────────

app.use(express.json({ limit: '256mb' }));
app.use(express.urlencoded({ extended: false, limit: '256mb' }));
app.use(morgan('dev'));

// Static files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/outlets', require('./routes/outlet.routes'));
app.use('/api/admin/analytics', require('./routes/analytics.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/bulk', require('./routes/bulk.routes'));
app.use('/api/bulk-order', require('./routes/bulk-order.routes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Retail Connect Pro API is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    // Ensure CORS headers are present even on errors
    const origin = req.headers.origin;
    if (origin) {
        const normalizedOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(normalizedOrigin) || isAllowedDevLanOrigin(normalizedOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
    }

    console.error(`[Error Handler] ${req.method} ${req.url}:`, err.stack || err);
    
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
