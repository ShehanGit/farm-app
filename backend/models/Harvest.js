const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Crop = require('./Crop');

const Harvest = sequelize.define('Harvest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cropId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Crop,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,  // Perfect for YYYY-MM-DD
    allowNull: false
  },
  quantityKg: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  grade: {  // Renamed from 'quality' → 'grade' to match common farming terms
    type: DataTypes.ENUM('A', 'B', 'C', 'Reject'),
    allowNull: true,
    defaultValue: 'A'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,  // Adds createdAt & updatedAt automatically
  tableName: 'Harvests'  // Optional: explicit table name
});

// Associations
Crop.hasMany(Harvest, {
  foreignKey: 'cropId',
  onDelete: 'CASCADE'
});
Harvest.belongsTo(Crop, {
  foreignKey: 'cropId',
  as: 'Crop'  // This 'as' is important for include: ['Crop']
});

module.exports = Harvest;