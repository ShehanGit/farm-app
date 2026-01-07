const express = require('express');
const router = express.Router();
const { Harvest } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const harvests = await Harvest.findAll({ include: ['Crop'] });
    res.json(harvests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const harvest = await Harvest.create(req.body); // { cropId, date, quantityKg, grade?, notes? }
    res.status(201).json(harvest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const harvest = await Harvest.findByPk(req.params.id, { include: ['Crop'] });
    if (!harvest) return res.status(404).json({ msg: 'Harvest not found' });
    res.json(harvest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;