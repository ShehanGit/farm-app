const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BiosecurityLog = sequelize.define('BiosecurityLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  logDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  visitorDetails: {
    type: DataTypes.TEXT  // e.g., 'Vet visit, disinfected'
  },
  disinfectionMethod: {
    type: DataTypes.STRING
  },
  environmentalConditions: {
    type: DataTypes.JSON  // e.g., {temp: 25, humidity: 60}
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = BiosecurityLog;