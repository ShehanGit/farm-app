const { EggProductionLog, AnimalBatch } = require('../models');

exports.getEggProductionLogs = async (req, res) => {
  const { batchId } = req.params;  // Optional: filter by batch
  try {
    const where = batchId ? { batchId } : {};
    const logs = await EggProductionLog.findAll({ 
      where, 
      include: [AnimalBatch], 
      order: [['logDate', 'ASC']] 
    });
    // For graphs: Calculate totals, averages, and trends
    const totalEggs = logs.reduce((sum, log) => sum + log.eggCount, 0);
    const avgDaily = logs.length ? (totalEggs / logs.length).toFixed(2) : 0;
    // Weekly trend: Last 7 days vs previous 7 days
    const last7 = logs.slice(-7).reduce((sum, log) => sum + log.eggCount, 0) / 7 || 0;
    const prev7 = logs.slice(-14, -7).reduce((sum, log) => sum + log.eggCount, 0) / 7 || 0;
    const trendPercent = prev7 ? ((last7 - prev7) / prev7 * 100).toFixed(2) : 'N/A';
    res.json({ 
      logs, 
      summary: { 
        totalEggs, 
        avgDaily, 
        last7Avg: last7.toFixed(2), 
        trendPercent 
      } 
    });
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

exports.updateEggProductionLog = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await EggProductionLog.update(req.body, { where: { id } });
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