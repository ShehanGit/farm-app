const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Incubator = sequelize.define('Incubator', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'Main Hatcher'
  },
  type: {
    type: DataTypes.ENUM('hatching', 'lockdown'),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false  // e.g., 1000 eggs
  },
  currentLoad: {
    type: DataTypes.INTEGER,
    defaultValue: 0  // Auto-update from batches
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'offline'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Incubator;