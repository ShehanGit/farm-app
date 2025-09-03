const { EggProductionLog, AnimalBatch } = require('../models');

exports.getEggProductionLogs = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const logs = await EggProductionLog.findAll({ where, include: [AnimalBatch], order: [['logDate', 'ASC']] });
    // Enhanced graphs: Totals, avg, trends, breakdowns
    const totalEggs = logs.reduce((sum, log) => sum + log.eggCount, 0);
    const avgDaily = logs.length ? (totalEggs / logs.length).toFixed(2) : 0;
    const last7 = logs.slice(-7).reduce((sum, log) => sum + log.eggCount, 0) / 7 || 0;
    const prev7 = logs.slice(-14, -7).reduce((sum, log) => sum + log.eggCount, 0) / 7 || 0;
    const trendPercent = prev7 ? ((last7 - prev7) / prev7 * 100).toFixed(2) : 'N/A';
    // Breakdowns for sizes/characteristics (aggregate across logs)
    const sizesBreakdown = {};
    const characteristicsBreakdown = {};
    logs.forEach(log => {
      if (log.eggDetails) {
        for (const [key, value] of Object.entries(log.eggDetails.sizes || {})) {
          sizesBreakdown[key] = (sizesBreakdown[key] || 0) + value;
        }
        for (const [key, value] of Object.entries(log.eggDetails.characteristics || {})) {
          characteristicsBreakdown[key] = (characteristicsBreakdown[key] || 0) + value;
        }
      }
    });
    res.json({ logs, summary: { totalEggs, avgDaily, last7Avg: last7.toFixed(2), trendPercent, sizesBreakdown, characteristicsBreakdown } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addEggProductionLog = async (req, res) => {
  let { eggDetails, ...body } = req.body;
  // Auto-sum eggCount from details
  let eggCount = 0;
  if (eggDetails) {
    eggCount = Object.values(eggDetails.sizes || {}).reduce((sum, v) => sum + v, 0);
  }
  try {
    const log = await EggProductionLog.create({ ...body, eggDetails, eggCount });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEggProductionLog = async (req, res) => {
  const { id } = req.params;
  let { eggDetails, ...body } = req.body;
  // Auto-resum eggCount if details updated
  let eggCount = 0;
  if (eggDetails) {
    eggCount = Object.values(eggDetails.sizes || {}).reduce((sum, v) => sum + v, 0);
  }
  try {
    const [updated] = await EggProductionLog.update({ ...body, eggDetails, eggCount }, { where: { id } });
    if (updated) {
      const updatedLog = await EggProductionLog.findByPk(id, { include: [AnimalBatch] });
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