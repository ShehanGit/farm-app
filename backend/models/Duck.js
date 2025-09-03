const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Duck = sequelize.define('Duck', {
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
    allowNull: false  // e.g., 'Pekin Duck'
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

module.exports = Duck;