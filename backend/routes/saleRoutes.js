const express = require('express');
const router = express.Router();
const { Sale, Crop } = require('../models');  // USE Sale, not Harvest!!!
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// GET all sales with filters
router.get('/', auth, async (req, res) => {
  try {
    const where = {};
    if (req.query.cropId) where.cropId = req.query.cropId;
    if (req.query.start || req.query.end) {
      where.date = {};
      if (req.query.start) where.date[Op.gte] = req.query.start;
      if (req.query.end) where.date[Op.lte] = req.query.end;
    }

    const sales = await Sale.findAll({
      where,
      include: [{ model: Crop, attributes: ['type'] }],  // optional: get crop name
      order: [['date', 'DESC']]
    });

    res.json(sales);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST create new sale
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating sale with data:', req.body); // Debug log

    const sale = await Sale.create(req.body);  // NOW USING Sale MODEL

    // Fetch fresh with Crop info (optional)
    const newSale = await Sale.findByPk(sale.id, {
      include: [{ model: Crop, attributes: ['type'] }]
    });

    res.status(201).json(newSale || sale);
  } catch (err) {
    console.error('Error creating sale:', err); // This will show validation errors
    res.status(400).json({ 
      error: 'Failed to create sale', 
      details: err.message 
    });
  }
});

module.exports = router;