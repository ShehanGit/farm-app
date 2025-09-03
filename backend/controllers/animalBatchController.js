const { AnimalBatch } = require('../models');

exports.getAnimalBatches = async (req, res) => {
  try {
    const batches = await AnimalBatch.findAll();
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAnimalBatch = async (req, res) => {
  try {
    const batch = await AnimalBatch.create(req.body);
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAnimalBatch = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await AnimalBatch.update(req.body, { where: { id } });
    if (updated) {
      const updatedBatch = await AnimalBatch.findByPk(id);
      res.json(updatedBatch);
    } else {
      res.status(404).json({ msg: 'Batch not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAnimalBatch = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await AnimalBatch.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Batch deleted' });
    } else {
      res.status(404).json({ msg: 'Batch not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};