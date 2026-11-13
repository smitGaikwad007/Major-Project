require('dotenv').config();
const app = require('./app');

// Default port is 5000, configurable via environment variable
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Philately API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

// Gracefully handle port collisions (e.g. macOS AirPlay Receiver on port 5000)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = Number(PORT) + 1;
    console.warn(`[Notice] Port ${PORT} is already in use (common with macOS AirPlay).`);
    console.log(`Starting server on fallback port http://localhost:${fallbackPort}...`);
    app.listen(fallbackPort, () => {
      console.log(`====================================================`);
      console.log(`Philately API server running on http://localhost:${fallbackPort}`);
      console.log(`Health check: http://localhost:${fallbackPort}/api/health`);
      console.log(`====================================================`);
    });
  } else {
    console.error('Server error:', err);
  }
});
