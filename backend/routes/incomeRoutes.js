const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const auth = require('../middleware/auth');

router.get('/', auth, incomeController.getIncomes);
router.get('/:batchId', auth, incomeController.getIncomes);  // Per batch
router.post('/', auth, incomeController.addIncome);
router.put('/:id', auth, incomeController.updateIncome);
router.delete('/:id', auth, incomeController.deleteIncome);

module.exports = router;