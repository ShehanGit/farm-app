const express = require('express');
const router = express.Router();
const { Expense, Crop, AnimalBatch } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');

// GET all expenses with optional filters
router.get('/', auth, async (req, res) => {
  try {
    const where = {};

    // Filter by cropId
    if (req.query.cropId) {
      where.cropId = req.query.cropId;
    }

    // Filter by batchId
    if (req.query.batchId) {
      where.batchId = req.query.batchId;
    }

    // Filter by category
    if (req.query.category) {
      where.category = req.query.category;
    }

    // Filter by date range
    if (req.query.start || req.query.end) {
      where.date = {};
      if (req.query.start) {
        where.date[Op.gte] = req.query.start;
      }
      if (req.query.end) {
        where.date[Op.lte] = req.query.end;
      }
    }

    const expenses = await Expense.findAll({
      where,
      include: [
        { model: Crop, required: false },
        { model: AnimalBatch, required: false }
      ],
      order: [['date', 'DESC']]
    });

    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET single expense by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [
        { model: Crop, required: false },
        { model: AnimalBatch, required: false }
      ]
    });
    
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (err) {
    console.error('Error fetching expense:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST create new expense
router.post('/', auth, async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    
    await expense.update(req.body);
    res.json(expense);
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    
    await expense.destroy();
    res.json({ msg: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET expense summary
router.get('/summary/total', auth, async (req, res) => {
  try {
    const where = {};

    // Filter by date range
    if (req.query.start || req.query.end) {
      where.date = {};
      if (req.query.start) {
        where.date[Op.gte] = req.query.start;
      }
      if (req.query.end) {
        where.date[Op.lte] = req.query.end;
      }
    }

    const expenses = await Expense.findAll({ where });
    
    const total = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const byCategory = {};
    const byCrop = {};
    const byBatch = {};
    
    expenses.forEach(exp => {
      // By category
      const cat = exp.category || 'Other';
      byCategory[cat] = (byCategory[cat] || 0) + (exp.amount || 0);
      
      // By crop
      if (exp.cropId) {
        byCrop[exp.cropId] = (byCrop[exp.cropId] || 0) + (exp.amount || 0);
      }
      
      // By batch
      if (exp.batchId) {
        byBatch[exp.batchId] = (byBatch[exp.batchId] || 0) + (exp.amount || 0);
      }
    });
    
    res.json({
      total: Math.round(total),
      count: expenses.length,
      byCategory,
      byCrop,
      byBatch
    });
  } catch (err) {
    console.error('Error getting expense summary:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;