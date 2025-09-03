const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  feedTypeId: {  // New: Link to FeedType
    type: DataTypes.INTEGER,
    allowNull: false
  },
  item: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'Chicken Feed Batch'
  },
  quantityKg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  pricePerKgLKR: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  totalCostLKR: {
    type: DataTypes.FLOAT  // Auto-calc on add/update
  },
  supplier: {
    type: DataTypes.STRING
  },
  stockRemainingKg: {
    type: DataTypes.FLOAT,
    defaultValue: 0  // Updated from usage
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Inventory;