const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Crop = require('./Crop');

const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cropId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true  // One stock per crop
  },
  currentKg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

Crop.hasOne(Stock, { foreignKey: 'cropId', onDelete: 'CASCADE' });
Stock.belongsTo(Crop, { foreignKey: 'cropId' });

module.exports = Stock;