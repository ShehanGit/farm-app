const { Quail } = require('../models');

exports.getQuails = async (req, res) => {
  try {
    const quails = await Quail.findAll({ include: ['Animal'] });
    res.json(quails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addQuail = async (req, res) => {
  try {
    const quail = await Quail.create(req.body);
    res.status(201).json(quail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuail = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Quail.update(req.body, { where: { id } });
    if (updated) {
      const updatedQuail = await Quail.findByPk(id, { include: ['Animal'] });
      res.json(updatedQuail);
    } else {
      res.status(404).json({ msg: 'Quail record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuail = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Quail.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Quail record deleted' });
    } else {
      res.status(404).json({ msg: 'Quail record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};