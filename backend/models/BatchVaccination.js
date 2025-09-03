const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BatchVaccination = sequelize.define('BatchVaccination', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vaccineType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vaccinationDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  countVaccinated: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  costLKR: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = BatchVaccination;