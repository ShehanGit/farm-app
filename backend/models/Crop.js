const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Crop = sequelize.define('Crop', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  acre: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  yield_estimate: {
    type: DataTypes.JSON
  },
  sensor_data: {
    type: DataTypes.JSON
  }
});

module.exports = Crop;