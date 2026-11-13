const express = require('express');
const cors = require('cors');
const stampRoutes = require('./routes/stampRoutes');
const collectionRoutes = require('./routes/collectionRoutes');

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Philately – The Collector’s Society API',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      stamps: 'GET /api/stamps',
      collection: 'GET /api/collection',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount resource routers
app.use('/api/stamps', stampRoutes);
app.use('/api/collection', collectionRoutes);

// Centralized 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Basic global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
