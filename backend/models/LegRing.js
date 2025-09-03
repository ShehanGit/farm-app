const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LegRing = sequelize.define('LegRing', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chickenId: {
    type: DataTypes.INTEGER,  // Per chicken or batch
    allowNull: false
  },
  ringId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'small'
  },
  assignDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = LegRing;