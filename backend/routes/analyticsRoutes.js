const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// ==================== CROP ANALYTICS ROUTES ====================

// Get farm-wide profit summary with optional date filters
// Query params: ?start=2025-01-01&end=2025-12-31
router.get('/profit-summary', auth, analyticsController.getProfitSummary);

// Get time series data for a specific crop
// Query params: ?start=2025-01-01&end=2025-12-31
router.get('/crop-timeseries/:id', auth, analyticsController.getCropTimeSeries);

// ==================== POULTRY ANALYTICS ROUTES ====================

// Egg production trends
// Query params: ?batchId=1&startDate=2025-01-01&endDate=2025-12-31
router.get('/egg-production-trends', auth, analyticsController.getEggProductionTrends);

// Feed conversion ratio
// Query params: ?batchId=1&startDate=2025-01-01&endDate=2025-12-31
router.get('/feed-conversion-ratio', auth, analyticsController.getFeedConversionRatio);

// Feed efficiency
// Query params: ?batchId=1&startDate=2025-01-01&endDate=2025-12-31
router.get('/feed-efficiency', auth, analyticsController.getFeedEfficiency);

// Cost vs Income
// Query params: ?batchId=1&startDate=2025-01-01&endDate=2025-12-31
router.get('/cost-vs-income', auth, analyticsController.getCostVsIncome);

// Financial summary
// Query params: ?batchId=1&startDate=2025-01-01&endDate=2025-12-31
router.get('/financial-summary', auth, analyticsController.getFinancialSummary);

// Batch performance
// Query params: ?batchId=1&startDate=2025-01-01&endDate=2025-12-31
router.get('/batch-performance', auth, analyticsController.getBatchPerformance);

module.exports = router;