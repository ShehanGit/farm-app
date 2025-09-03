const express = require('express');
const router = express.Router();
const biosecurityLogController = require('../controllers/biosecurityLogController');
const auth = require('../middleware/auth');

router.get('/', auth, biosecurityLogController.getBiosecurityLogs);
router.get('/:batchId', auth, biosecurityLogController.getBiosecurityLogs);  // Per batch
router.post('/', auth, biosecurityLogController.addBiosecurityLog);
router.put('/:id', auth, biosecurityLogController.updateBiosecurityLog);
router.delete('/:id', auth, biosecurityLogController.deleteBiosecurityLog);

module.exports = router;