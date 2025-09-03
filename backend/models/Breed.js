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
    type: DataTypes.INTEGER  // 1-10
  },
  temperamentDescription: {
    type: DataTypes.STRING
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
  averageEggColor: {  // New: e.g., 'brown'
    type: DataTypes.STRING
  },
  noiseLevelRating: {  // New: 1-10 (quiet to noisy)
    type: DataTypes.INTEGER
  },
  flightinessScore: {  // New: 1-10 (calm to flighty)
    type: DataTypes.INTEGER
  },
  dualPurposeRating: {  // New: 1-10 for meat/egg balance
    type: DataTypes.INTEGER
  },
  parasiteResistanceLevel: {  // New: 1-10
    type: DataTypes.INTEGER
  },
  averageAnnualFeedConsumptionKg: {  // New: Per chicken
    type: DataTypes.FLOAT
  },
  healthyWeightByAgeMonths: {
    type: DataTypes.JSON
  }
});

module.exports = Breed;