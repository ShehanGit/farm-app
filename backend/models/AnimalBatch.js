const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AnimalBatch = sequelize.define('AnimalBatch', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batch_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  animal_type: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'hen', 'goat', 'bee'
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  arrival_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  health_status: {
    type: DataTypes.STRING,  // e.g., 'healthy', 'quarantined'
    defaultValue: 'healthy'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = AnimalBatch;