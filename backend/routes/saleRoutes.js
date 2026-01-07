const express = require('express');
const router = express.Router();
const { Sale } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.findAll({ include: ['Crop'] });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const sale = await Sale.create(req.body); // { cropId, date, quantityKg, pricePerKg, buyer?, notes? }
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, { include: ['Crop'] });
    if (!sale) return res.status(404).json({ msg: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const where = {};
    if (req.query.cropId) where.cropId = req.query.cropId;
    const sales = await Sale.findAll({
      where,
      include: ['Crop'],
      order: [['date', 'DESC']]
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;