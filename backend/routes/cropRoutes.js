const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const auth = require('../middleware/auth');

router.get('/', auth, cropController.getCrops);
router.post('/', auth, cropController.addCrop);

module.exports = router;