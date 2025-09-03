const { EggProductionLog, AnimalBatch } = require('../models');

exports.getEggProductionLogs = async (req, res) => {
  const { batchId } = req.params;  // Optional per batch
  try {
    const where = batchId ? { batchId } : {};
    const logs = await EggProductionLog.findAll({ where, include: [AnimalBatch], order: [['logDate', 'ASC']] });
    // For graphs: Calculate totals/practical averages
    const totalEggs = logs.reduce((sum, log) => sum + log.eggCount, 0);
    const avgDaily = totalEggs / logs.length || 0;
    res.json({ logs, summary: { totalEggs, avgDaily } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addEggProductionLog = async (req, res) => {
  try {
    const log = await EggProductionLog.create(req.body);  // Manual input
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update/delete similar
exports.updateEggProductionLog = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await EggProductionLog.update(req.body, { where: { id } });
    if (updated) {
      const updatedLog = await EggProductionLog.findByPk(id);
      res.json(updatedLog);
    } else {
      res.status(404).json({ msg: 'Log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEggProductionLog = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await EggProductionLog.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Log deleted' });
    } else {
      res.status(404).json({ msg: 'Log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};