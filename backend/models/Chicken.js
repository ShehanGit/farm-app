const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Chicken = sequelize.define('Chicken', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  parentBatchId: {
    type: DataTypes.INTEGER
  },
  parentNotes: {
    type: DataTypes.TEXT
  },
  sex: {
    type: DataTypes.ENUM('male', 'female', 'unknown'),
    defaultValue: 'unknown'
  },
  purchasePriceLKR: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  petName: {
    type: DataTypes.STRING
  },
  injuries: {
    type: DataTypes.JSON
  },
  legBandHistory: {
    type: DataTypes.JSON
  },
  status: {
    type: DataTypes.ENUM('active', 'nonLaying', 'sold', 'deceased'),
    defaultValue: 'active'
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true
  },
  laying_rate: {
    type: DataTypes.INTEGER,
    defaultValue: 200
  },
  vaccination_history: {
    type: DataTypes.JSON
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Chicken;