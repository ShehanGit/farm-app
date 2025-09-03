const { EggHatching } = require('../models');

exports.getEggHatchings = async (req, res) => {
  try {
    const hatchings = await EggHatching.findAll();
    res.json(hatchings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addEggHatching = async (req, res) => {
  try {
    const hatching = await EggHatching.create(req.body);
    res.status(201).json(hatching);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEggHatching = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await EggHatching.update(req.body, { where: { id } });
    if (updated) {
      const updatedHatching = await EggHatching.findByPk(id);
      res.json(updatedHatching);
    } else {
      res.status(404).json({ msg: 'Batch not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEggHatching = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await EggHatching.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Batch deleted' });
    } else {
      res.status(404).json({ msg: 'Batch not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};