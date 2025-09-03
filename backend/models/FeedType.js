const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FeedType = sequelize.define('FeedType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false  // e.g., 'starter'
  },
  description: {
    type: DataTypes.TEXT  // e.g., 'For young chicks'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = FeedType;