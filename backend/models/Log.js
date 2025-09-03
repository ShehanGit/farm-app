const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'health_alert'
  },
  details: {
    type: DataTypes.TEXT
  }
});

module.exports = Log;