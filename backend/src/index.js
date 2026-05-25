const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Configure environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ── Prometheus Metrics Setup ──────────────────────────────────────────
const client = require('prom-client');
const register = new client.Registry();

// Enable default metrics (CPU, Memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metric: HTTP request duration histogram
const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.9, 1.5, 3, 5]
});
register.registerMetric(httpRequestDurationSeconds);

// Middleware to monitor request performance
app.use((req, res, next) => {
    if (req.path === '/metrics') {
        return next();
    }
    const end = httpRequestDurationSeconds.startTimer();
    res.on('finish', () => {
        // If route matches a router path, use that to avoid high cardinality, e.g. /api/jobs/:id
        const route = req.route ? req.route.path : req.path;
        end({
            method: req.method,
            route: route || req.path,
            status_code: res.statusCode
        });
    });
    next();
});

// Metrics expose endpoint for Prometheus
app.get('/metrics', async (req, res) => {
    try {
        res.setHeader('Content-Type', register.contentType);
        res.send(await register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});
// ──────────────────────────────────────────────────────────────────────

// Debug logging for requests (Moved to top)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

// Enable CORS with specific options
// Always allow the known Render frontend + localhost for dev.
// If FRONTEND_URL env var is also set on Render, that is included too.
const allowedOrigins = [
    'https://careernest-frontendfinding-online-jobs.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, curl, Postman, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight for all routes
app.options('/{*path}', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet()); 
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Basic Route
app.get('/', (req, res) => {
    res.send('Welcome to CareerNest API');
});

// Health Check Endpoint — used by Docker HEALTHCHECK and Render monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const profileRoutes = require('./routes/profileRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5001;

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   IP:    http://127.0.0.1:${PORT}`);
});
