const { Expense, AnimalBatch } = require('../models');

exports.getExpenses = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const expenses = await Expense.findAll({ where, include: [AnimalBatch] });
    const total = expenses.reduce((sum, exp) => sum + exp.amountLKR, 0);
    res.json({ expenses, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Expense.update(req.body, { where: { id } });
    if (updated) {
      const updatedExpense = await Expense.findByPk(id);
      res.json(updatedExpense);
    } else {
      res.status(404).json({ msg: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Expense.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Expense deleted' });
    } else {
      res.status(404).json({ msg: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};