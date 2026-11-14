const express = require('express');
const cors = require('cors');
const stampRoutes = require('./routes/stampRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const pdaRoutes = require('./routes/pdaRoutes');
const verificationRoutes = require('./routes/verificationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Philately – The Collector’s Society API',
    version: '1.1.0',
    documentation: {
      health: 'GET /api/health',
      stamps: 'GET /api/stamps',
      collection: 'GET /api/collection',
      pda: 'GET /api/pda/accounts, POST /api/pda/open, GET /api/pda/releases',
      verification: 'GET /api/verification/public-key, POST /api/verification/verify-seal, POST /api/verification/generate-seal, POST /api/verification/fair-allocation'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/stamps', stampRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/pda', pdaRoutes);
app.use('/api/verification', verificationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
