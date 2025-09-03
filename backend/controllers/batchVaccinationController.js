const { BatchVaccination, AnimalBatch } = require('../models');

exports.getBatchVaccinations = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const vaccinations = await BatchVaccination.findAll({ where, include: [AnimalBatch], order: [['vaccinationDate', 'ASC']] });
    // Summary for practical insights
    const totalVaccinated = vaccinations.reduce((sum, vac) => sum + vac.countVaccinated, 0);
    const totalCostLKR = vaccinations.reduce((sum, vac) => sum + (vac.costLKR || 0), 0);
    res.json({ vaccinations, summary: { totalVaccinated, totalCostLKR } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBatchVaccination = async (req, res) => {
  try {
    const vaccination = await BatchVaccination.create(req.body);
    // Auto-update batch health_status to 'vaccinated'
    if (vaccination) {
      const batch = await AnimalBatch.findByPk(vaccination.batchId);
      if (batch) await batch.update({ health_status: 'vaccinated' });
    }
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
      const updatedVaccination = await BatchVaccination.findByPk(id, { include: [AnimalBatch] });
      res.json(updatedVaccination);
    } else {
      res.status(404).json({ msg: 'Batch vaccination not found' });
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
      res.json({ msg: 'Batch vaccination deleted' });
    } else {
      res.status(404).json({ msg: 'Batch vaccination not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};