const express = require('express');
const router = express.Router();
const { Task, Crop } = require('../models');
const auth = require('../middleware/auth');
// Get all tasks with smart sorting
router.get('/', auth, async (req, res) => {
  try {
    const { cropId, status, overdue, priority } = req.query;
    const where = {};

    if (cropId) where.cropId = cropId === 'null' ? null : cropId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (overdue === 'true') {
      where.dueDate = { [require('sequelize').Op.lt]: new Date() };
      where.status = { [require('sequelize').Op.ne]: 'done' };
    }

    const tasks = await Task.findAll({
      where,
      include: [{ model: Crop, attributes: ['id', 'type'] }],
      order: [
        ['priority', 'DESC'],      // Critical first
        ['isReminder', 'DESC'],    // Reminders next
        ['dueDate', 'ASC'],        // Soonest due
        ['createdAt', 'DESC']
      ]
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new task
router.post('/', auth, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    const taskWithCrop = await Task.findByPk(task.id, { include: [Crop] });
    res.status(201).json(taskWithCrop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task (status, progress, etc.)
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    await task.update(req.body);
    const updated = await Task.findByPk(task.id, { include: [Crop] });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    await task.destroy();
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


