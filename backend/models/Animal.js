const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Animal = sequelize.define('Animal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  health_metrics: {
    type: DataTypes.JSON  // Flexible for biometrics
  },
  yield_data: {
    type: DataTypes.JSON  // e.g., {eggs_per_year: 200}
  }
});

module.exports = Animal;