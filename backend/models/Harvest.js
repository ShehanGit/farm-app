const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Crop = require('./Crop');

const Harvest = sequelize.define('Harvest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cropId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  quantityKg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  grade: {
    type: DataTypes.ENUM('A', 'B', 'C', 'Other'),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

Crop.hasMany(Harvest, { foreignKey: 'cropId', onDelete: 'CASCADE' });
Harvest.belongsTo(Crop, { foreignKey: 'cropId' });

module.exports = Harvest;