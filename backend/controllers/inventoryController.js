const { Inventory, FeedType } = require('../models');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll({ include: [FeedType] });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addInventory = async (req, res) => {
  const { quantityKg, pricePerKgLKR, ...body } = req.body;
  const totalCostLKR = quantityKg * pricePerKgLKR;
  try {
    const item = await Inventory.create({ ...body, quantityKg, pricePerKgLKR, totalCostLKR, stockRemainingKg: quantityKg });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  const { id } = req.params;
  const { quantityKg, pricePerKgLKR, ...body } = req.body;
  const totalCostLKR = quantityKg * pricePerKgLKR;
  try {
    const [updated] = await Inventory.update({ ...body, quantityKg, pricePerKgLKR, totalCostLKR }, { where: { id } });
    if (updated) {
      const updatedItem = await Inventory.findByPk(id, { include: [FeedType] });
      res.json(updatedItem);
    } else {
      res.status(404).json({ msg: 'Inventory not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Inventory.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Inventory deleted' });
    } else {
      res.status(404).json({ msg: 'Inventory not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeedAnalytics = async (req, res) => {  // New: For later analytics (totals per type)
  const { feedTypeId } = req.params;
  try {
    const where = feedTypeId ? { feedTypeId } : {};
    const items = await Inventory.findAll({ where, include: [FeedType] });
    const totalBoughtKg = items.reduce((sum, item) => sum + item.quantityKg, 0);
    const totalCostLKR = items.reduce((sum, item) => sum + item.totalCostLKR, 0);
    const avgPricePerKg = totalBoughtKg ? (totalCostLKR / totalBoughtKg).toFixed(2) : 0;
    res.json({ items, summary: { totalBoughtKg, totalCostLKR, avgPricePerKg } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};