const express = require('express');
const router = express.Router();
const supplementLogController = require('../controllers/supplementLogController');
const auth = require('../middleware/auth');

router.get('/', auth, supplementLogController.getSupplementLogs);
router.get('/:batchId', auth, supplementLogController.getSupplementLogs);  // Per batch
router.post('/', auth, supplementLogController.addSupplementLog);
router.put('/:id', auth, supplementLogController.updateSupplementLog);
router.delete('/:id', auth, supplementLogController.deleteSupplementLog);

module.exports = router;