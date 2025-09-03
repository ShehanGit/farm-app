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
  incubatorId: {  // New: Link to Incubator
    type: DataTypes.INTEGER,
    allowNull: false
  },
  breedId: {
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
  hatch_started_day: {
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
  humidityLog: {
    type: DataTypes.JSON
  },
  eggTurnLog: {
    type: DataTypes.JSON
  },
  fertilityCheckDate: {
    type: DataTypes.DATE
  },
  storageDurationDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  machine_code: {
    type: DataTypes.STRING
  },
  tray_number: {
    type: DataTypes.STRING
  },
  eggSource: {
    type: DataTypes.ENUM('ownFarm', 'purchased', 'other'),
    defaultValue: 'ownFarm'
  },
  chickQualityNotes: {
    type: DataTypes.TEXT
  },
  failureReasons: {
    type: DataTypes.JSON
  },
  failureAnalysis: {
    type: DataTypes.TEXT
  },
  hatchSuccessMetrics: {
    type: DataTypes.JSON
  },
  removalLog: {  // New: JSON for removals (e.g., [{date, removedCount, reason}])
    type: DataTypes.JSON
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