const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

router.get('/', auth, expenseController.getExpenses);
router.get('/:batchId', auth, expenseController.getExpenses);  // Per batch
router.post('/', auth, expenseController.addExpense);
router.put('/:id', auth, expenseController.updateExpense);
router.delete('/:id', auth, expenseController.deleteExpense);

router.get('/', auth, async (req, res) => {
  try {
    const where = {};
    if (req.query.cropId) {
      where.cropId = req.query.cropId === 'null' ? null : req.query.cropId;
    }
    const limit = parseInt(req.query.limit) || 20;
    const expenses = await Expense.findAll({
      where,
      include: ['Crop'],
      order: [['date', 'DESC']]
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;