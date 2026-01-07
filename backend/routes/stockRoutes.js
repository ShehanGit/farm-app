const express = require('express');
const router = express.Router();
const { Stock } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const stocks = await Stock.findAll({ include: ['Crop'] });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:cropId', auth, async (req, res) => {
  const { currentKg, notes } = req.body;
  try {
    const [stock, created] = await Stock.upsert({
      cropId: req.params.cropId,
      currentKg,
      notes
    });
    res.status(created ? 201 : 200).json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;