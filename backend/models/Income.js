const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Income = sequelize.define('Income', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batchId: {
    type: DataTypes.INTEGER
  },
  category: {
    type: DataTypes.ENUM('eggSales', 'meatSales', 'manureSales', 'byProductSales', 'agritourism', 'grantsSubsidies', 'other'),
    allowNull: false
  },
  amountLKR: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  incomeDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Income;