const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EggHatching = sequelize.define('EggHatching', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batch_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number_of_eggs: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hatch_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  success_rate: {
    type: DataTypes.FLOAT,  // e.g., 0.85 for 85%
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT  // Optional details
  }
});

module.exports = EggHatching;