const { LifeEvent, Chicken } = require('../models');
const { Op } = require('sequelize');

exports.getLifeEvents = async (req, res) => {
  const { chickenId } = req.params;  // Optional: per chicken or all
  try {
    const where = chickenId ? { chickenId } : {};
    const events = await LifeEvent.findAll({ where, order: [['eventDate', 'ASC']] });
    // Calculate durations for graphs (e.g., days between events)
    const enhancedEvents = events.map((event, index) => {
      if (index === 0) return { ...event.toJSON(), durationFromPrevious: 0 };
      const prevDate = new Date(events[index - 1].eventDate);
      const currDate = new Date(event.eventDate);
      const duration = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));  // Days
      return { ...event.toJSON(), durationFromPrevious: duration };
    });
    res.json(enhancedEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addLifeEvent = async (req, res) => {
  try {
    const event = await LifeEvent.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update/delete similar to others
exports.updateLifeEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await LifeEvent.update(req.body, { where: { id } });
    if (updated) {
      const updatedEvent = await LifeEvent.findByPk(id);
      res.json(updatedEvent);
    } else {
      res.status(404).json({ msg: 'Life event not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLifeEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await LifeEvent.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Life event deleted' });
    } else {
      res.status(404).json({ msg: 'Life event not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};