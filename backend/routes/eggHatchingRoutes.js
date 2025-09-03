const express = require('express');
const router = express.Router();
const eggHatchingController = require('../controllers/eggHatchingController');
const auth = require('../middleware/auth');

router.get('/', auth, eggHatchingController.getEggHatchings);
router.post('/', auth, eggHatchingController.addEggHatching);
router.put('/:id', auth, eggHatchingController.updateEggHatching);
router.delete('/:id', auth, eggHatchingController.deleteEggHatching);
router.get('/upcoming', auth, eggHatchingController.getUpcomingHatches);
router.get('/:id/status', auth, eggHatchingController.getHatchingStatus);  // New for graphs/charts

module.exports = router;