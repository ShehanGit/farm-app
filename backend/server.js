const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, syncDatabase } = require('./models');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Crop routes
const cropRoutes = require('./routes/cropRoutes');
app.use('/api/crops', cropRoutes);

// Harvest routes
const harvestRoutes = require('./routes/harvestRoutes');
app.use('/api/harvests', harvestRoutes);

// Sale routes
const saleRoutes = require('./routes/saleRoutes');
app.use('/api/sales', saleRoutes);

// Stock routes
const stockRoutes = require('./routes/stockRoutes');
app.use('/api/stocks', stockRoutes);

// Wastage routes
const wastageRoutes = require('./routes/wastageRoutes');
app.use('/api/wastages', wastageRoutes);

// Inventory routes
const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/api/inventory', inventoryRoutes);

// Analytics routes - IMPORTANT: Add this!
const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);

// Expense routes (if you have one)
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

// Task routes (if you have one)
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Animal/Poultry routes (if you have them)
// const animalRoutes = require('./routes/animalRoutes');
// app.use('/api/animals', animalRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync database
    await syncDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;