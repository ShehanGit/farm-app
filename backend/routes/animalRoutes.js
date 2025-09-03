const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const auth = require('../middleware/auth');

router.get('/', auth, animalController.getAnimals);
router.post('/', auth, animalController.addAnimal);

module.exports = router;