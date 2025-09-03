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
  inventoryId: {  // New: Link to Inventory for deduct
    type: DataTypes.INTEGER
  },
  logDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  feedAmountKg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  feedTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  costLKR: {
    type: DataTypes.FLOAT
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = FeedConsumptionLog;