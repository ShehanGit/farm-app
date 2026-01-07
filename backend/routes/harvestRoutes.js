const express = require('express');
const router = express.Router();
const { Harvest } = require('../models');
const { Op } = require('sequelize');  // ← Must import Op
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const where = {};

    // Filter by cropId
    if (req.query.cropId) {
      where.cropId = req.query.cropId;
    }

    // Filter by date range
    if (req.query.start || req.query.end) {
      where.date = {};  // ← Correct syntax
      if (req.query.start) {
        where.date[Op.gte] = req.query.start;
      }
      if (req.query.end) {
        where.date[Op.lte] = req.query.end;
      }
    }

    const harvests = await Harvest.findAll({
      where,
      include: ['Crop'],
      order: [['date', 'DESC']]
    });

    res.json(harvests);
  } catch (err) {
    console.error('Error fetching harvests:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const harvest = await Harvest.create(req.body);
    res.status(201).json(harvest);
  } catch (err) {
    console.error('Error creating harvest:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;