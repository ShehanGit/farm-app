const express = require('express');
const router = express.Router();
const eggProductionLogController = require('../controllers/eggProductionLogController');
const auth = require('../middleware/auth');

router.get('/', auth, eggProductionLogController.getEggProductionLogs);
router.get('/:batchId', auth, eggProductionLogController.getEggProductionLogs);  // Per batch
router.post('/', auth, eggProductionLogController.addEggProductionLog);
router.put('/:id', auth, eggProductionLogController.updateEggProductionLog);
router.delete('/:id', auth, eggProductionLogController.deleteEggProductionLog);

module.exports = router;