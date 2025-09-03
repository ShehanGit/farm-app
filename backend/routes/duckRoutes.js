const express = require('express');
const router = express.Router();
const duckController = require('../controllers/duckController');
const auth = require('../middleware/auth');

router.get('/', auth, duckController.getDucks);
router.post('/', auth, duckController.addDuck);
router.put('/:id', auth, duckController.updateDuck);
router.delete('/:id', auth, duckController.deleteDuck);
router.get('/:id/lineage', auth, duckController.getLineage);  // Added for lineage

module.exports = router;