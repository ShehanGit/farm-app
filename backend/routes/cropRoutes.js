const express = require('express');
const router = express.Router();
const { Crop } = require('../models');  // Make sure this import is correct
const auth = require('../middleware/auth');

// GET all crops
router.get('/', auth, async (req, res) => {
  try {
    const crops = await Crop.findAll();
    res.json(crops);
  } catch (err) {
    console.error('Error fetching crops:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST create new crop
router.post('/', auth, async (req, res) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json(crop);
  } catch (err) {
    console.error('Error creating crop:', err);
    res.status(500).json({ error: err.message });
  }
});

// ADD THIS: GET single crop by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const crop = await Crop.findByPk(req.params.id);
    if (!crop) {
      return res.status(404).json({ msg: 'Crop not found' });
    }
    res.json(crop);
  } catch (err) {
    console.error('Error fetching crop by ID:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;