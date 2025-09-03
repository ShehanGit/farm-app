const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Breed = sequelize.define('Breed', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isBroody: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  averageLifespanMonths: {
    type: DataTypes.INTEGER
  },
  timeToFirstEggWeeks: {
    type: DataTypes.INTEGER
  },
  productiveLayingPeriodMonths: {
    type: DataTypes.INTEGER
  },
  averageChickMarketPriceLKR: {
    type: DataTypes.FLOAT
  },
  hardinessRating: {
    type: DataTypes.INTEGER
  },
  temperamentDescription: {
    type: DataTypes.STRING
  },
  eggSizeCategory: {
    type: DataTypes.ENUM('small', 'medium', 'large')
  },
  coldToleranceLevel: {
    type: DataTypes.INTEGER
  },
  heatToleranceLevel: {
    type: DataTypes.INTEGER
  },
  forageAbilityRating: {
    type: DataTypes.INTEGER
  },
  healthyWeightByAgeMonths: {
    type: DataTypes.JSON
  },
  hatchDurationDays: {  // New: e.g., 21 for chickens
    type: DataTypes.INTEGER,
    defaultValue: 21
  },
  lockdownPeriodDays: {  // New: e.g., 3 for last days
    type: DataTypes.INTEGER,
    defaultValue: 3
  }
});

module.exports = Breed;