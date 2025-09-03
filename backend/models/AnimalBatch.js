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
  keepingMethod: {
    type: DataTypes.ENUM('freeRange', 'organic', 'conventional', 'pastureRaised', 'cageFree', 'batteryCage', 'enrichedCage', 'aviary', 'other'),
    defaultValue: 'conventional'
  },
  keepingMethodHistory: {  // New: JSON for method changes, e.g., [{date, method, notes}]
    type: DataTypes.JSON
  },
  batchCostLKR: {  // New: Total expenses for batch
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  mortalityRate: {  // New: Percentage, manually/calculated updated
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  performanceMetrics: {  // New: JSON for ratios, e.g., {feedToEggRatio: 2.5}
    type: DataTypes.JSON
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = AnimalBatch;