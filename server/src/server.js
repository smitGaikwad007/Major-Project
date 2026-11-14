require('dotenv').config();
const app = require('./app');
const prisma = require('./db/config');

const PORT = process.env.PORT || 5000;

prisma.seedDatabase().catch(() => {});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Philately API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

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
