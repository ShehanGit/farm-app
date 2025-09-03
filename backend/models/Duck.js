const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Duck = sequelize.define('Duck', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  production_rate: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  vaccination_history: {
    type: DataTypes.JSON
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Duck;