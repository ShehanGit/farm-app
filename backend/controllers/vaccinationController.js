const { Vaccination } = require('../models');

exports.getVaccinations = async (req, res) => {
  try {
    const vaccinations = await Vaccination.findAll({ include: ['Animal'] });  // Include linked animal
    res.json(vaccinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addVaccination = async (req, res) => {
  let { dose_date, next_dose_date, ...body } = req.body;
  if (!next_dose_date && dose_date) {
    // Basic auto-calc: e.g., next dose in 30 days (customize as needed)
    const doseDate = new Date(dose_date);
    next_dose_date = new Date(doseDate.setDate(doseDate.getDate() + 30));
  }
  try {
    const vaccination = await Vaccination.create({ ...body, dose_date, next_dose_date });
    res.status(201).json(vaccination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVaccination = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Vaccination.update(req.body, { where: { id } });
    if (updated) {
      const updatedVaccination = await Vaccination.findByPk(id, { include: ['Animal'] });
      // Check for overdue status (advanced logic example)
      if (updatedVaccination.next_dose_date < new Date() && updatedVaccination.status !== 'overdue') {
        await updatedVaccination.update({ status: 'overdue' });
      }
      res.json(updatedVaccination);
    } else {
      res.status(404).json({ msg: 'Vaccination not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVaccination = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Vaccination.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Vaccination deleted' });
    } else {
      res.status(404).json({ msg: 'Vaccination not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOverdueVaccinations = async (req, res) => {  // Advanced: Fetch overdue for reminders
  try {
    const overdue = await Vaccination.findAll({
      where: { next_dose_date: { [sequelize.Op.lt]: new Date() }, status: 'scheduled' },
      include: ['Animal']
    });
    res.json(overdue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};