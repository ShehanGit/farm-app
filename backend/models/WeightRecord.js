const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WeightRecord = sequelize.define('WeightRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chickenId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  measurementDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  measuredWeightKg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = WeightRecord;