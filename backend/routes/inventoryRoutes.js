const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

router.get('/', auth, inventoryController.getInventory);
router.post('/', auth, inventoryController.addInventory);
router.get('/analytics/:feedTypeId', auth, inventoryController.getFeedAnalytics);

module.exports = router;