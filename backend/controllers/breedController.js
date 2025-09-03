const { Breed } = require('../models');

exports.getBreeds = async (req, res) => {
  try {
    const breeds = await Breed.findAll();
    res.json(breeds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBreed = async (req, res) => {
  try {
    const breed = await Breed.create(req.body);
    res.status(201).json(breed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBreed = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Breed.update(req.body, { where: { id } });
    if (updated) {
      const updatedBreed = await Breed.findByPk(id);
      res.json(updatedBreed);
    } else {
      res.status(404).json({ msg: 'Breed not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBreed = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Breed.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Breed deleted' });
    } else {
      res.status(404).json({ msg: 'Breed not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};