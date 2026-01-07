const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cropId: {
    type: DataTypes.INTEGER,
    allowNull: true  // null means farm-wide expense
  },
  batchId: {
    type: DataTypes.INTEGER,
    allowNull: true  // For animal batches
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  amountLKR: {  // Alias for compatibility with poultry code
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('amount');
    }
  },
  expenseDate: {  // Alias for compatibility with poultry code
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('date');
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Other'
    // Common categories: 'Fertilizer', 'Labor', 'Seeds', 'Pesticides', 
    // 'Equipment', 'Feed', 'Medicine', 'Utilities', 'Other'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Expense;