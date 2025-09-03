const { EggHatching, AnimalBatch, Breed } = require('../models');
const { Op } = require('sequelize');

exports.getEggHatchings = async (req, res) => {
  try {
    const hatchings = await EggHatching.findAll({ include: [AnimalBatch, Breed] });
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
      const updatedHatching = await EggHatching.findByPk(id, { include: [AnimalBatch, Breed] });
      // Auto-calc hatchability
      if (updatedHatching.hatched_count > 0) {
        const rate = (updatedHatching.hatched_count / updatedHatching.number_of_eggs) || 0;
        await updatedHatching.update({ hatchability_rate: rate });
      }
      // Update status based on dates
      const daysLeft = Math.ceil((new Date(updatedHatching.hatch_date) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= updatedHatching.Breed.lockdownPeriodDays && updatedHatching.status === 'incubating') {
        await updatedHatching.update({ status: 'lockdown' });
      } else if (daysLeft <= 0 && updatedHatching.status !== 'hatched') {
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

exports.getUpcomingHatches = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const upcoming = await EggHatching.findAll({
      where: {
        hatch_date: { [Op.between]: [today, nextWeek] },
        status: { [Op.in]: ['incubating', 'lockdown'] }
      },
      include: [AnimalBatch, Breed]
    });
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ... existing code ...

exports.updateEggHatching = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await EggHatching.update(req.body, { where: { id } });
    if (updated) {
      const updatedHatching = await EggHatching.findByPk(id, { include: [AnimalBatch, Breed, Incubator] });
      // Auto-calc hatchability
      if (updatedHatching.hatched_count > 0) {
        const rate = (updatedHatching.hatched_count / updatedHatching.number_of_eggs) || 0;
        await updatedHatching.update({ hatchability_rate: rate });
      }
      res.json(updatedHatching);
    } else {
      res.status(404).json({ msg: 'Hatching batch not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeEggs = async (req, res) => {  // New: Change status for removed eggs
  const { id } = req.params;
  const { removedCount, reason } = req.body;
  try {
    const hatching = await EggHatching.findByPk(id);
    if (!hatching) return res.status(404).json({ msg: 'Hatching batch not found' });
    const newEggs = hatching.number_of_eggs - removedCount;
    const removalEntry = { date: new Date(), removedCount, reason };
    const removalLog = hatching.removalLog || [];
    removalLog.push(removalEntry);
    await hatching.update({ number_of_eggs: newEggs, removalLog });
    res.json({ msg: 'Eggs removed', updatedHatching: hatching });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... existing getHatchingStatus for charts ...

exports.getHatchingStatus = async (req, res) => {  // New: For graphs/charts
  const { id } = req.params;
  try {
    const hatching = await EggHatching.findByPk(id, { include: [Breed] });
    if (!hatching) return res.status(404).json({ msg: 'Hatching batch not found' });
    const daysToHatch = Math.ceil((new Date(hatching.hatch_date) - new Date(hatching.hatch_started_day)) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, Math.ceil((new Date(hatching.hatch_date) - new Date()) / (1000 * 60 * 60 * 24)));
    const isLockdown = daysLeft <= hatching.Breed.lockdownPeriodDays;
    const timeline = {
      totalDuration: hatching.Breed.hatchDurationDays,
      daysElapsed: hatching.Breed.hatchDurationDays - daysLeft,
      stages: {
        storage: hatching.storageDurationDays,
        incubation: daysToHatch - hatching.Breed.lockdownPeriodDays,
        lockdown: hatching.Breed.lockdownPeriodDays,
        hatched: hatching.status === 'hatched' ? 'Completed' : 'Pending'
      }
    };
    res.json({ hatching, status: { daysLeft, isLockdown, timeline } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};