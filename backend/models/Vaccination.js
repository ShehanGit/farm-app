const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vaccination = sequelize.define('Vaccination', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  animalId: {  // Foreign key for association
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vaccine_type: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'Newcastle Disease'
  },
  dose_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  next_dose_date: {
    type: DataTypes.DATE  // For reminders
  },
  administered_by: {
    type: DataTypes.STRING  // e.g., 'Vet Name'
  },
  status: {
    type: DataTypes.ENUM('administered', 'scheduled', 'overdue'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Vaccination;