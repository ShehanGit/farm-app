const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FeedConsumptionLog = sequelize.define('FeedConsumptionLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  logDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  feedAmountKg: {
    type: DataTypes.FLOAT,
    allowNull: false  // Manual total consumed
  },
  feedType: {
    type: DataTypes.STRING  // e.g., 'organic grain'
  },
  costLKR: {
    type: DataTypes.FLOAT
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = FeedConsumptionLog;