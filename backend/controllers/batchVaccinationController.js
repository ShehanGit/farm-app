const { BatchVaccination, AnimalBatch } = require('../models');

exports.getBatchVaccinations = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const vaccinations = await BatchVaccination.findAll({ where, include: [AnimalBatch] });
    res.json(vaccinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBatchVaccination = async (req, res) => {
  try {
    const vaccination = await BatchVaccination.create(req.body);
    res.status(201).json(vaccination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBatchVaccination = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await BatchVaccination.update(req.body, { where: { id } });
    if (updated) {
      const updatedVaccination = await BatchVaccination.findByPk(id);
      res.json(updatedVaccination);
    } else {
      res.status(404).json({ msg: 'Vaccination not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBatchVaccination = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await BatchVaccination.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Vaccination deleted' });
    } else {
      res.status(404).json({ msg: 'Vaccination not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};