const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batchId: {
    type: DataTypes.INTEGER  // Optional per batch
  },
  category: {
    type: DataTypes.ENUM('labor', 'equipment', 'utilities', 'vetServices', 'feedPurchases', 'maintenance', 'other'),
    allowNull: false
  },
  amountLKR: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  expenseDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Expense;