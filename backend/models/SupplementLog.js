const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SupplementLog = sequelize.define('SupplementLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  supplementType: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'vitamins', 'minerals'
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  logDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  supplier: {
    type: DataTypes.STRING
  },
  costLKR: {
    type: DataTypes.FLOAT
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = SupplementLog;