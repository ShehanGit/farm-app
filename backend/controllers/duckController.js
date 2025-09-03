const { Duck } = require('../models');

exports.getDucks = async (req, res) => {
  try {
    const ducks = await Duck.findAll({ include: ['Animal'] });
    res.json(ducks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addDuck = async (req, res) => {
  try {
    const duck = await Duck.create(req.body);
    res.status(201).json(duck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDuck = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Duck.update(req.body, { where: { id } });
    if (updated) {
      const updatedDuck = await Duck.findByPk(id, { include: ['Animal'] });
      res.json(updatedDuck);
    } else {
      res.status(404).json({ msg: 'Duck record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDuck = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Duck.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Duck record deleted' });
    } else {
      res.status(404).json({ msg: 'Duck record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};