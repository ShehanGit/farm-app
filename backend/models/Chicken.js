const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Chicken = sequelize.define('Chicken', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  animalId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  breedId: {  // New: Foreign key for Breed
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parentId: {  // For lineages (self-referencing)
    type: DataTypes.INTEGER
  },
  petName: {
    type: DataTypes.STRING
  },
  injuries: {
    type: DataTypes.JSON  // e.g., [{date, description}]
  },
  legBandHistory: {
    type: DataTypes.JSON  // e.g., [{date, bandId, size}]
  },
  status: {
    type: DataTypes.ENUM('active', 'nonLaying', 'sold', 'deceased'),
    defaultValue: 'active'
  },
  breed: {  // Legacy, but use breedId now
    type: DataTypes.STRING,
    allowNull: false
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