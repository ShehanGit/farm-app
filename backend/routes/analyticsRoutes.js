const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.get('/egg-production-trends', auth, analyticsController.getEggProductionTrends);
router.get('/feed-conversion-ratio', auth, analyticsController.getFeedConversionRatio);
router.get('/cost-vs-income', auth, analyticsController.getCostVsIncome);
router.get('/batch-performance', auth, analyticsController.getBatchPerformance);
router.get('/profit-summary', auth, analyticsController.getProfitSummary);

module.exports = router;