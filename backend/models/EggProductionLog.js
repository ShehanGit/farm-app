const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EggProductionLog = sequelize.define('EggProductionLog', {
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
  eggCount: {
    type: DataTypes.INTEGER,
    allowNull: false  // Auto-sum from eggDetails
  },
  eggDetails: {  // New: JSON for sizes/characteristics
    type: DataTypes.JSON,  // e.g., {sizes: {small: 10, medium: 20, large: 15, jumbo: 5, other: 2}, characteristics: {cracked: 5, dirty: 3, thinShell: 1, oddShape: 2, doubleYolk: 4, clean: 30, normal: 20, other: 1}}
    defaultValue: {}
  },
  qualityNotes: {
    type: DataTypes.TEXT
  }
});

module.exports = EggProductionLog;