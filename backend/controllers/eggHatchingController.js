const { EggHatching, AnimalBatch } = require('../models');
const { Op } = require('sequelize');

exports.getEggHatchings = async (req, res) => {
  try {
    const hatchings = await EggHatching.findAll({ include: [AnimalBatch] });
    // Summary for graphs: Avg hatchability, success stats
    const totalHatched = hatchings.reduce((sum, h) => sum + h.hatched_count, 0);
    const avgHatchability = hatchings.length ? (hatchings.reduce((sum, h) => sum + h.hatchability_rate, 0) / hatchings.length).toFixed(2) : 0;
    res.json({ hatchings, summary: { totalHatched, avgHatchability } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addEggHatching = async (req, res) => {
  try {
    const hatching = await EggHatching.create(req.body);
    res.status(201).json(hatching);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEggHatching = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await EggHatching.update(req.body, { where: { id } });
    if (updated) {
      const updatedHatching = await EggHatching.findByPk(id, { include: [AnimalBatch] });
      // Auto-calc hatchability if hatched_count provided
      if (updatedHatching.hatched_count > 0) {
        const rate = (updatedHatching.hatched_count / updatedHatching.number_of_eggs) || 0;
        await updatedHatching.update({ hatchability_rate: rate });
      }
      // Update status if hatched
      if (req.body.status === 'hatched') {
        await updatedHatching.update({ status: 'hatched' });
      }
      res.json(updatedHatching);
    } else {
      res.status(404).json({ msg: 'Hatching batch not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEggHatching = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await EggHatching.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Hatching batch deleted' });
    } else {
      res.status(404).json({ msg: 'Hatching batch not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUpcomingHatches = async (req, res) => {  // New: Reminders for near hatch dates
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const upcoming = await EggHatching.findAll({
      where: {
        hatch_date: { [Op.between]: [today, nextWeek] },
        status: 'incubating'
      },
      include: [AnimalBatch]
    });
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};