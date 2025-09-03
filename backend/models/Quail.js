const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quail = sequelize.define('Quail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  animalId: {  // Foreign key for association
    type: DataTypes.INTEGER,
    allowNull: false
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'Japanese Quail'
  },
  production_rate: {
    type: DataTypes.INTEGER,  // e.g., eggs/year or meat metrics
    defaultValue: 0
  },
  vaccination_history: {
    type: DataTypes.JSON
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Quail;