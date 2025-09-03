const { FeedConsumptionLog, AnimalBatch } = require('../models');

exports.getFeedConsumptionLogs = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const logs = await FeedConsumptionLog.findAll({ where, include: [AnimalBatch], order: [['logDate', 'ASC']] });
    // For graphs: Totals/practical metrics
    const totalFeedKg = logs.reduce((sum, log) => sum + log.feedAmountKg, 0);
    const totalCostLKR = logs.reduce((sum, log) => sum + (log.costLKR || 0), 0);
    const avgDailyKg = totalFeedKg / logs.length || 0;
    res.json({ logs, summary: { totalFeedKg, totalCostLKR, avgDailyKg } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFeedConsumptionLog = async (req, res) => {
  try {
    const log = await FeedConsumptionLog.create(req.body);  // Manual input
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update/delete similar
exports.updateFeedConsumptionLog = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await FeedConsumptionLog.update(req.body, { where: { id } });
    if (updated) {
      const updatedLog = await FeedConsumptionLog.findByPk(id);
      res.json(updatedLog);
    } else {
      res.status(404).json({ msg: 'Log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFeedConsumptionLog = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await FeedConsumptionLog.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Log deleted' });
    } else {
      res.status(404).json({ msg: 'Log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};