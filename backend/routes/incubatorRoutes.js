const express = require('express');
const router = express.Router();
const incubatorController = require('../controllers/incubatorController');
const auth = require('../middleware/auth');

router.get('/', auth, incubatorController.getIncubators);
router.post('/', auth, incubatorController.addIncubator);
router.put('/:id', auth, incubatorController.updateIncubator);
router.delete('/:id', auth, incubatorController.deleteIncubator);

module.exports = router;