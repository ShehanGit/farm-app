const { SupplementLog, AnimalBatch } = require('../models');

exports.getSupplementLogs = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const logs = await SupplementLog.findAll({ where, include: [AnimalBatch], order: [['logDate', 'ASC']] });
    const totalCostLKR = logs.reduce((sum, log) => sum + (log.costLKR || 0), 0);
    res.json({ logs, summary: { totalCostLKR } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addSupplementLog = async (req, res) => {
  try {
    const log = await SupplementLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSupplementLog = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await SupplementLog.update(req.body, { where: { id } });
    if (updated) {
      const updatedLog = await SupplementLog.findByPk(id, { include: [AnimalBatch] });
      res.json(updatedLog);
    } else {
      res.status(404).json({ msg: 'Supplement log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSupplementLog = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await SupplementLog.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Supplement log deleted' });
    } else {
      res.status(404).json({ msg: 'Supplement log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};