const { Inventory } = require('../models');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addInventory = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};