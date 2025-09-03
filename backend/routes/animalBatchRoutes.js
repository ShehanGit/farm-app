const express = require('express');
const router = express.Router();
const animalBatchController = require('../controllers/animalBatchController');
const auth = require('../middleware/auth');

router.get('/', auth, animalBatchController.getAnimalBatches);
router.post('/', auth, animalBatchController.addAnimalBatch);
router.put('/:id', auth, animalBatchController.updateAnimalBatch);
router.delete('/:id', auth, animalBatchController.deleteAnimalBatch);

module.exports = router;