const { Animal } = require('../models');

exports.getAnimals = async (req, res) => {
  try {
    const animals = await Animal.findAll();
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAnimal = async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add update/delete similarly if needed