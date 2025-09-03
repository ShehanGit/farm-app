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
    allowNull: false  // Link to AnimalBatch
  },
  logDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  eggCount: {
    type: DataTypes.INTEGER,
    allowNull: false  // Manual daily total
  },
  qualityNotes: {
    type: DataTypes.TEXT  // e.g., 'High quality, no cracks'
  }
});

module.exports = EggProductionLog;