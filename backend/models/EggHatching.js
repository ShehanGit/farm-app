const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EggHatching = sequelize.define('EggHatching', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batchId: {  // New: Link to AnimalBatch for source
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
  hatch_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  hatched_count: {  // New: For hatchability calc
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  hatchability_rate: {  // Auto-calculated
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  incubationMethod: {  // New: Enum for types
    type: DataTypes.ENUM('natural', 'artificial', 'custom'),
    defaultValue: 'artificial'
  },
  temperatureLog: {  // New: JSON for daily readings
    type: DataTypes.JSON  // e.g., [{date: "2025-09-01", temp: 37.5}]
  },
  storageDurationDays: {  // New: Pre-incubation storage
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  chickQualityNotes: {  // New: Quality assessment
    type: DataTypes.TEXT
  },
  failureReasons: {  // New: JSON for issues
    type: DataTypes.JSON  // e.g., ["infertile", "temperature fluctuation"]
  },
  status: {  // Improved: Enum
    type: DataTypes.ENUM('incubating', 'hatched', 'failed'),
    defaultValue: 'incubating'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = EggHatching;