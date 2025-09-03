const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

router.get('/', auth, expenseController.getExpenses);
router.get('/:batchId', auth, expenseController.getExpenses);  // Per batch
router.post('/', auth, expenseController.addExpense);
router.put('/:id', auth, expenseController.updateExpense);
router.delete('/:id', auth, expenseController.deleteExpense);

module.exports = router;