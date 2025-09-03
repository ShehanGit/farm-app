const express = require('express');
const router = express.Router();
const feedTypeController = require('../controllers/feedTypeController');
const auth = require('../middleware/auth');

router.get('/', auth, feedTypeController.getFeedTypes);
router.post('/', auth, feedTypeController.addFeedType);
router.put('/:id', auth, feedTypeController.updateFeedType);
router.delete('/:id', auth, feedTypeController.deleteFeedType);

module.exports = router;