const express = require('express');
const router = express.Router();
const eggHatchingController = require('../controllers/eggHatchingController');
const auth = require('../middleware/auth');

router.get('/', auth, eggHatchingController.getEggHatchings);
router.post('/', auth, eggHatchingController.addEggHatching);
router.put('/:id', auth, eggHatchingController.updateEggHatching);
router.delete('/:id', auth, eggHatchingController.deleteEggHatching);

module.exports = router;