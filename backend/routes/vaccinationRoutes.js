const express = require('express');
const router = express.Router();
const vaccinationController = require('../controllers/vaccinationController');
const auth = require('../middleware/auth');

router.get('/', auth, vaccinationController.getVaccinations);
router.post('/', auth, vaccinationController.addVaccination);
router.put('/:id', auth, vaccinationController.updateVaccination);
router.delete('/:id', auth, vaccinationController.deleteVaccination);
router.get('/overdue', auth, vaccinationController.getOverdueVaccinations);  // Advanced endpoint

module.exports = router;