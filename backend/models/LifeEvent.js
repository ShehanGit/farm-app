const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LifeEvent = sequelize.define('LifeEvent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chickenId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  eventType: {
    type: DataTypes.ENUM('hatched', 'firstEgg', 'sold', 'markedNonLaying', 'other'),
    allowNull: false
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT
  }
});

module.exports = LifeEvent;