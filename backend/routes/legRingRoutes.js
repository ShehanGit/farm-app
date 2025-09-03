const express = require('express');
const router = express.Router();
const legRingController = require('../controllers/legRingController');
const auth = require('../middleware/auth');

router.get('/', auth, legRingController.getLegRings);
router.get('/:chickenId', auth, legRingController.getLegRings);  // Per chicken
router.post('/', auth, legRingController.addLegRing);
router.put('/:id', auth, legRingController.updateLegRing);
router.delete('/:id', auth, legRingController.deleteLegRing);

module.exports = router;