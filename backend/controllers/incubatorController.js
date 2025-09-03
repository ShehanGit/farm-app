const { Incubator, EggHatching } = require('../models');

exports.getIncubators = async (req, res) => {
  try {
    const incubators = await Incubator.findAll();
    res.json(incubators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addIncubator = async (req, res) => {
  try {
    const incubator = await Incubator.create(req.body);
    res.status(201).json(incubator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateIncubator = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Incubator.update(req.body, { where: { id } });
    if (updated) {
      const updatedIncubator = await Incubator.findByPk(id);
      res.json(updatedIncubator);
    } else {
      res.status(404).json({ msg: 'Incubator not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteIncubator = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Incubator.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Incubator deleted' });
    } else {
      res.status(404).json({ msg: 'Incubator not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};