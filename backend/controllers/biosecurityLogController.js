const { BiosecurityLog, AnimalBatch } = require('../models');

exports.getBiosecurityLogs = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const logs = await BiosecurityLog.findAll({ where, include: [AnimalBatch], order: [['logDate', 'ASC']] });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBiosecurityLog = async (req, res) => {
  try {
    const log = await BiosecurityLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBiosecurityLog = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await BiosecurityLog.update(req.body, { where: { id } });
    if (updated) {
      const updatedLog = await BiosecurityLog.findByPk(id);
      res.json(updatedLog);
    } else {
      res.status(404).json({ msg: 'Log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBiosecurityLog = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await BiosecurityLog.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Log deleted' });
    } else {
      res.status(404).json({ msg: 'Log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};