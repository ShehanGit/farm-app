const express = require('express');
const router = express.Router();
const weightRecordController = require('../controllers/weightRecordController');
const auth = require('../middleware/auth');

router.get('/', auth, weightRecordController.getWeightRecords);
router.get('/:chickenId', auth, weightRecordController.getWeightRecords);  // Per chicken
router.post('/', auth, weightRecordController.addWeightRecord);
router.put('/:id', auth, weightRecordController.updateWeightRecord);
router.delete('/:id', auth, weightRecordController.deleteWeightRecord);
router.get('/comparison/:chickenId', auth, weightRecordController.getWeightComparison);  // Advanced comparison

module.exports = router;