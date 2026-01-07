const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Crop = require('./Crop');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cropId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('todo', 'in_progress', 'done'),
    defaultValue: 'todo'
  },
  progressPercent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0, max: 100 }
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  isReminder: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  hooks: {
    beforeUpdate: (task) => {
      if (task.status === 'done' && !task.completedAt) {
        task.completedAt = new Date();
      }
      if (task.status !== 'in_progress') {
        task.progressPercent = task.status === 'done' ? 100 : 0;
      }
    }
  }
});

Crop.hasMany(Task, { foreignKey: 'cropId', onDelete: 'SET NULL' });
Task.belongsTo(Crop, { foreignKey: 'cropId' });

module.exports = Task;