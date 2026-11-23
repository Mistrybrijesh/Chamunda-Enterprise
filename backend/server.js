const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CORS ────────────────────────────────────────────────────
const allowedOrigins = [
  'https://chamunda-enterprise-admin.vercel.app',
  'https://chamunda-enterprise.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.ADMIN_URL,
  process.env.CLIENT_URL,
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow Postman / server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    // Production + localhost
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments of this project
    if (
      /^https:\/\/chamunda-enterprise-(admin|gamma|[^.]+).*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }

    console.log('❌ CORS blocked:', origin);
    return callback(null, false);
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],

  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Preflight
app.options('*', cors(corsOptions));

// ─── Uploads ─────────────────────────────────────────────────
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ─── Database ────────────────────────────────────────────────
let mongoConnectionPromise;

const connectDatabase = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error('MONGO_URI is not configured'));
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log('✅ MongoDB connected');
      })
      .catch((err) => {
        mongoConnectionPromise = undefined;
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
      });
  }

  return mongoConnectionPromise;
};

if (process.env.MONGO_URI) {
  connectDatabase().catch(() => {});
}

// ─── Routes ──────────────────────────────────────────────────
app.use('/api', async (_req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    res.status(503).json({
      success: false,
      message: 'Database unavailable',
    });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/payments', require('./routes/payments'));

// ─── Health Check ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🪑 Furniture API is running',
    status: 'OK',
  });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;