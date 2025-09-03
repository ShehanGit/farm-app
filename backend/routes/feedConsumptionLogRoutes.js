const express = require('express');
const router = express.Router();
const feedConsumptionLogController = require('../controllers/feedConsumptionLogController');
const auth = require('../middleware/auth');

router.get('/', auth, feedConsumptionLogController.getFeedConsumptionLogs);
router.get('/:batchId', auth, feedConsumptionLogController.getFeedConsumptionLogs);
router.post('/', auth, feedConsumptionLogController.addFeedConsumptionLog);
router.put('/:id', auth, feedConsumptionLogController.updateFeedConsumptionLog);
router.delete('/:id', auth, feedConsumptionLogController.deleteFeedConsumptionLog);

module.exports = router;