const express = require('express');
const router = express.Router();
const lifeEventController = require('../controllers/lifeEventController');
const auth = require('../middleware/auth');

router.get('/', auth, lifeEventController.getLifeEvents);
router.get('/:chickenId', auth, lifeEventController.getLifeEvents);  // Per chicken
router.post('/', auth, lifeEventController.addLifeEvent);
router.put('/:id', auth, lifeEventController.updateLifeEvent);
router.delete('/:id', auth, lifeEventController.deleteLifeEvent);

module.exports = router;