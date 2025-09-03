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
    allowNull: false  // e.g., 'Rhode Island Red'
  },
  isBroody: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  averageLifespanMonths: {
    type: DataTypes.INTEGER  // e.g., 96 for 8 years
  },
  timeToFirstEggWeeks: {
    type: DataTypes.INTEGER  // e.g., 20
  },
  productiveLayingPeriodMonths: {
    type: DataTypes.INTEGER  // e.g., 36
  },
  averageChickMarketPriceLKR: {
    type: DataTypes.FLOAT  // e.g., 500.00
  },
  hardinessRating: {
    type: DataTypes.INTEGER  // 1-10
  },
  temperamentDescription: {
    type: DataTypes.STRING  // e.g., 'Calm'
  },
  eggSizeCategory: {
    type: DataTypes.ENUM('small', 'medium', 'large')
  },
  coldToleranceLevel: {
    type: DataTypes.INTEGER  // 1-10
  },
  heatToleranceLevel: {
    type: DataTypes.INTEGER  // 1-10
  },
  forageAbilityRating: {
    type: DataTypes.INTEGER  // 1-10
  },
  healthyWeightByAgeMonths: {
    type: DataTypes.JSON  // e.g., [{ageMonths: 1, weightKg: 0.5}, {ageMonths: 3, weightKg: 1.2}]
  }
});

module.exports = Breed;