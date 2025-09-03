const express = require('express');
const router = express.Router();
const batchVaccinationController = require('../controllers/batchVaccinationController');
const auth = require('../middleware/auth');

router.get('/', auth, batchVaccinationController.getBatchVaccinations);
router.get('/:batchId', auth, batchVaccinationController.getBatchVaccinations);  // Per batch
router.post('/', auth, batchVaccinationController.addBatchVaccination);
router.put('/:id', auth, batchVaccinationController.updateBatchVaccination);
router.delete('/:id', auth, batchVaccinationController.deleteBatchVaccination);

module.exports = router;