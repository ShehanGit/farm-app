const express = require('express');
const router = express.Router();
const { Wastage } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const wastages = await Wastage.findAll({ include: ['Harvest'] });
    res.json(wastages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const wastage = await Wastage.create(req.body); // { harvestId, date, quantityKg, reason?, notes? }
    res.status(201).json(wastage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;