const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Crop = require('./Crop');

const Sale = sequelize.define('Sale', {
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
  pricePerKg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  buyer: {
    type: DataTypes.STRING,
    allowNull: true  // e.g., "Wholesale Market", "Exporter X"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

Crop.hasMany(Sale, { foreignKey: 'cropId', onDelete: 'CASCADE' });
Sale.belongsTo(Crop, { foreignKey: 'cropId' });

module.exports = Sale;