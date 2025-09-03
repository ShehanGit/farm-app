const { FeedConsumptionLog, AnimalBatch } = require('../models');

exports.getFeedConsumptionLogs = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const logs = await FeedConsumptionLog.findAll({ 
      where, 
      include: [AnimalBatch], 
      order: [['logDate', 'ASC']] 
    });
    // For graphs: Totals, averages, trends (weekly for frontend charts)
    const totalFeedKg = logs.reduce((sum, log) => sum + log.feedAmountKg, 0);
    const totalCostLKR = logs.reduce((sum, log) => sum + (log.costLKR || 0), 0);
    const avgDailyKg = logs.length ? (totalFeedKg / logs.length).toFixed(2) : 0;
    const last7Kg = logs.slice(-7).reduce((sum, log) => sum + log.feedAmountKg, 0) / 7 || 0;
    const prev7Kg = logs.slice(-14, -7).reduce((sum, log) => sum + log.feedAmountKg, 0) / 7 || 0;
    const trendPercent = prev7Kg ? ((last7Kg - prev7Kg) / prev7Kg * 100).toFixed(2) : 'N/A';
    res.json({ 
      logs, 
      summary: { 
        totalFeedKg, 
        totalCostLKR, 
        avgDailyKg, 
        last7Kg: last7Kg.toFixed(2), 
        trendPercent 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFeedConsumptionLog = async (req, res) => {
  try {
    const log = await FeedConsumptionLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFeedConsumptionLog = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await FeedConsumptionLog.update(req.body, { where: { id } });
    if (updated) {
      const updatedLog = await FeedConsumptionLog.findByPk(id, { include: [AnimalBatch] });
      res.json(updatedLog);
    } else {
      res.status(404).json({ msg: 'Feed consumption log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... existing code ...

exports.addFeedConsumptionLog = async (req, res) => {
  const { inventoryId, feedAmountKg, ...body } = req.body;
  try {
    const log = await FeedConsumptionLog.create({ ...body, inventoryId, feedAmountKg });
    // Optional auto-deduct from inventory if linked
    if (inventoryId) {
      const inventory = await Inventory.findByPk(inventoryId);
      if (inventory) {
        const newStock = inventory.stockRemainingKg - feedAmountKg;
        await inventory.update({ stockRemainingKg: newStock });
      }
    }
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... rest same ...

exports.deleteFeedConsumptionLog = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await FeedConsumptionLog.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Feed consumption log deleted' });
    } else {
      res.status(404).json({ msg: 'Feed consumption log not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};