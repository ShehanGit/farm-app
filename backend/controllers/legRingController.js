const { LegRing, Chicken } = require('../models');

exports.getLegRings = async (req, res) => {
  const { chickenId } = req.params;
  try {
    const where = chickenId ? { chickenId } : {};
    const rings = await LegRing.findAll({ where, include: [Chicken], order: [['assignDate', 'ASC']] });
    res.json(rings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addLegRing = async (req, res) => {
  try {
    const ring = await LegRing.create(req.body);
    res.status(201).json(ring);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLegRing = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await LegRing.update(req.body, { where: { id } });
    if (updated) {
      const updatedRing = await LegRing.findByPk(id);
      res.json(updatedRing);
    } else {
      res.status(404).json({ msg: 'Leg ring not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLegRing = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await LegRing.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Leg ring deleted' });
    } else {
      res.status(404).json({ msg: 'Leg ring not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};