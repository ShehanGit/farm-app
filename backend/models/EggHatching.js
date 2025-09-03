const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EggHatching = sequelize.define('EggHatching', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batchId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  breedId: {  // New: Breed egg belongs to
    type: DataTypes.INTEGER,
    allowNull: false
  },
  batch_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number_of_eggs: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hatch_started_day: {  // New: Incubation start
    type: DataTypes.DATE,
    allowNull: false
  },
  hatch_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  hatched_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  hatchability_rate: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  incubationMethod: {
    type: DataTypes.ENUM('natural', 'artificial', 'custom'),
    defaultValue: 'artificial'
  },
  temperatureLog: {
    type: DataTypes.JSON
  },
  humidityLog: {  // Essential: JSON for readings
    type: DataTypes.JSON
  },
  eggTurnLog: {  // Essential: JSON for turning counts
    type: DataTypes.JSON  // e.g., [{date: "2025-09-01", turns: 3}]
  },
  fertilityCheckDate: {  // Essential: Candling date
    type: DataTypes.DATE
  },
  storageDurationDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  machine_code: {  // New: Hatching machine code
    type: DataTypes.STRING
  },
  tray_number: {  // New: Tray location
    type: DataTypes.STRING
  },
  eggSource: {  // Essential: 'own farm', 'purchased'
    type: DataTypes.ENUM('ownFarm', 'purchased', 'other'),
    defaultValue: 'ownFarm'
  },
  chickQualityNotes: {
    type: DataTypes.TEXT
  },
  failureReasons: {
    type: DataTypes.JSON
  },
  failureAnalysis: {  // Essential: Text summary
    type: DataTypes.TEXT
  },
  hatchSuccessMetrics: {  // Essential: JSON for viability
    type: DataTypes.JSON  // e.g., {viableChicks: 800, weak: 50}
  },
  status: {
    type: DataTypes.ENUM('stored', 'incubating', 'lockdown', 'hatched', 'failed'),
    defaultValue: 'incubating'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = EggHatching;