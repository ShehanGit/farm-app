const { WeightRecord, Chicken, Breed } = require('../models');

exports.getWeightRecords = async (req, res) => {
  const { chickenId } = req.params;  // Optional per chicken
  try {
    const where = chickenId ? { chickenId } : {};
    const records = await WeightRecord.findAll({ where, include: [{ model: Chicken, include: Breed }] });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addWeightRecord = async (req, res) => {
  try {
    const record = await WeightRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWeightComparison = async (req, res) => {
  const { chickenId } = req.params;
  try {
    const chicken = await Chicken.findByPk(chickenId, { include: Breed });
    if (!chicken) return res.status(404).json({ msg: 'Chicken not found' });
    const records = await WeightRecord.findAll({ where: { chickenId }, order: [['measurementDate', 'ASC']] });
    const comparisons = records.map(record => {
      const ageMonths = Math.round((new Date(record.measurementDate) - new Date(chicken.createdAt)) / (1000 * 60 * 60 * 24 * 30));  // Approx age
      const expected = chicken.Breed.healthyWeightByAgeMonths.find(w => w.ageMonths === ageMonths)?.weightKg || 'N/A';
      return { ...record.toJSON(), expectedWeight: expected, difference: expected !== 'N/A' ? record.measuredWeightKg - expected : 'N/A' };
    });
    res.json(comparisons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update/delete similar
exports.updateWeightRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await WeightRecord.update(req.body, { where: { id } });
    if (updated) {
      const updatedRecord = await WeightRecord.findByPk(id);
      res.json(updatedRecord);
    } else {
      res.status(404).json({ msg: 'Weight record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWeightRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await WeightRecord.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Weight record deleted' });
    } else {
      res.status(404).json({ msg: 'Weight record not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};