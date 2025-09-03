const express = require('express');
const router = express.Router();
const quailController = require('../controllers/quailController');
const auth = require('../middleware/auth');

router.get('/', auth, quailController.getQuails);
router.post('/', auth, quailController.addQuail);
router.put('/:id', auth, quailController.updateQuail);
router.delete('/:id', auth, quailController.deleteQuail);
router.get('/:id/lineage', auth, quailController.getLineage);  // Added for lineage

module.exports = router;