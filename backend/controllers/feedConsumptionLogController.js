const { FeedConsumptionLog, AnimalBatch, Inventory } = require('../models');
const { Op } = require('sequelize');

exports.getFeedConsumptionLogs = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const logs = await FeedConsumptionLog.findAll({ where, include: [AnimalBatch], order: [['logDate', 'ASC']] });
    const totalFeedKg = logs.reduce((sum, log) => sum + log.feedAmountKg, 0);
    const totalCostLKR = logs.reduce((sum, log) => sum + (log.costLKR || 0), 0);
    const avgDailyKg = logs.length ? (totalFeedKg / logs.length).toFixed(2) : 0;
    const last7Kg = logs.slice(-7).reduce((sum, log) => sum + log.feedAmountKg, 0) / 7 || 0;
    const prev7Kg = logs.slice(-14, -7).reduce((sum, log) => sum + log.feedAmountKg, 0) / 7 || 0;
    const trendPercent = prev7Kg ? ((last7Kg - prev7Kg) / prev7Kg * 100).toFixed(2) : 'N/A';
    res.json({ logs, summary: { totalFeedKg, totalCostLKR, avgDailyKg, last7Kg: last7Kg.toFixed(2), trendPercent } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFeedConsumptionLog = async (req, res) => {
  let { feedAmountKg, feedTypeId, costLKR, ...body } = req.body;
  try {
    // FIFO: Find oldest non-depleted inventory for type
    const inventories = await Inventory.findAll({
      where: { feedTypeId, isDepleted: false, stockRemainingKg: { [Op.gt]: 0 } },
      order: [['purchaseDate', 'ASC']]
    });
    let remainingAmount = feedAmountKg;
    let calculatedCost = 0;
    let usedInventories = [];
    for (let inv of inventories) {
      if (remainingAmount <= 0) break;
      const useAmount = Math.min(remainingAmount, inv.stockRemainingKg);
      calculatedCost += useAmount * inv.pricePerKgLKR;
      const newStock = inv.stockRemainingKg - useAmount;
      await inv.update({ stockRemainingKg: newStock, isDepleted: newStock <= 0 });
      remainingAmount -= useAmount;
      usedInventories.push({ inventoryId: inv.id, usedKg: useAmount });
    }
    // If no stock or insufficient, use average price from all type inventories
    if (remainingAmount > 0) {
      const allInv = await Inventory.findAll({ where: { feedTypeId } });
      const avgPrice = allInv.length ? (allInv.reduce((sum, i) => sum + i.pricePerKgLKR, 0) / allInv.length) : 0;
      calculatedCost += remainingAmount * avgPrice;
    }
    // Use calculated if no manual costLKR
    if (!costLKR) costLKR = calculatedCost;
    const log = await FeedConsumptionLog.create({ ...body, feedAmountKg, feedTypeId, costLKR });
    res.status(201).json({ log, usedInventories });
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