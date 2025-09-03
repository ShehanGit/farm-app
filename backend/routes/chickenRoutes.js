const express = require('express');
const router = express.Router();
const chickenController = require('../controllers/chickenController');
const auth = require('../middleware/auth');

router.get('/', auth, chickenController.getChickens);
router.post('/', auth, chickenController.addChicken);
router.put('/:id', auth, chickenController.updateChicken);
router.delete('/:id', auth, chickenController.deleteChicken);

router.get('/:id/lineage', auth, chickenController.getLineage);

module.exports = router;