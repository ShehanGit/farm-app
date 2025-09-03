const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MortalityRecord = sequelize.define('MortalityRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chickenId: {
    type: DataTypes.INTEGER
  },
  batchId: {
    type: DataTypes.INTEGER
  },
  deathDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  cause: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'disease'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = MortalityRecord;