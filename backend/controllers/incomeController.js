const { Income, AnimalBatch } = require('../models');

exports.getIncomes = async (req, res) => {
  const { batchId } = req.params;
  try {
    const where = batchId ? { batchId } : {};
    const incomes = await Income.findAll({ where, include: [AnimalBatch] });
    const totalAmountLKR = incomes.reduce((sum, inc) => sum + inc.amountLKR, 0);
    res.json({ incomes, summary: { totalAmountLKR } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addIncome = async (req, res) => {
  try {
    const income = await Income.create(req.body);
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateIncome = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Income.update(req.body, { where: { id } });
    if (updated) {
      const updatedIncome = await Income.findByPk(id, { include: [AnimalBatch] });
      res.json(updatedIncome);
    } else {
      res.status(404).json({ msg: 'Income not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Income.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Income deleted' });
    } else {
      res.status(404).json({ msg: 'Income not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};