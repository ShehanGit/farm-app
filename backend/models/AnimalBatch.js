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
    allowNull: false
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
    type: DataTypes.STRING,
    defaultValue: 'healthy'
  },
  keepingMethod: {  // Expanded for all practical types
    type: DataTypes.ENUM('freeRange', 'certifiedOrganic', 'conventional', 'pastureRaised', 'cageFree', 'batteryCage', 'enrichedCage', 'aviary', 'mixed', 'other'),
    defaultValue: 'conventional'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = AnimalBatch;