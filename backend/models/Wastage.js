const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Harvest = require('./Harvest');

const Wastage = sequelize.define('Wastage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  harvestId: {
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
  reason: {
    type: DataTypes.STRING,
    allowNull: true  // e.g., "Spoilage", "Pest Damage"
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

Harvest.hasMany(Wastage, { foreignKey: 'harvestId', onDelete: 'CASCADE' });
Wastage.belongsTo(Harvest, { foreignKey: 'harvestId' });

module.exports = Wastage;