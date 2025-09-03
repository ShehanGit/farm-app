const { Crop } = require('../models');

exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.findAll();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCrop = async (req, res) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};