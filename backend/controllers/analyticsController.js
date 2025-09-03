const { EggProductionLog, FeedConsumptionLog, Income, Expense, LifeEvent, AnimalBatch } = require('../models');
const { Op } = require('sequelize');



// ... existing imports ...

exports.getEggProductionTrends = async (req, res) => {
  const { batchId, startDate, endDate } = req.query;
  try {
    const where = batchId ? { batchId } : {};
    if (startDate && endDate) {
      where.logDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const logs = await EggProductionLog.findAll({ where, include: [AnimalBatch], order: [['logDate', 'ASC']] });
    const totalEggs = logs.reduce((sum, log) => sum + log.eggCount, 0);
    const avgDaily = logs.length ? (totalEggs / logs.length).toFixed(2) : 0;
    // Trends for graphs (e.g., weekly totals)
    const weeklyTotals = [];
    let weekSum = 0;
    logs.forEach((log, index) => {
      weekSum += log.eggCount;
      if ((index + 1) % 7 === 0 || index === logs.length - 1) {
        weeklyTotals.push(weekSum.toFixed(2));
        weekSum = 0;
      }
    });
    res.json({ logs, summary: { totalEggs, avgDaily, weeklyTotals } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeedConversionRatio = async (req, res) => {
  const { batchId, startDate, endDate } = req.query;
  try {
    const where = batchId ? { batchId } : {};
    if (startDate && endDate) {
      where.logDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const feedLogs = await FeedConsumptionLog.findAll({ where });
    const eggLogs = await EggProductionLog.findAll({ where });
    const totalFeedKg = feedLogs.reduce((sum, log) => sum + log.feedAmountKg, 0);
    const totalEggs = eggLogs.reduce((sum, log) => sum + log.eggCount, 0);
    const fcr = totalEggs ? (totalFeedKg / totalEggs).toFixed(2) : 0;  // Feed per egg
    res.json({ summary: { totalFeedKg, totalEggs, fcr } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCostVsIncome = async (req, res) => {
  const { batchId, startDate, endDate } = req.query;
  try {
    const incomeWhere = batchId ? { batchId } : {};
    if (startDate && endDate) {
      incomeWhere.incomeDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const incomes = await Income.findAll({ where: incomeWhere });
    const expenseWhere = batchId ? { batchId } : {};
    if (startDate && endDate) {
      expenseWhere.expenseDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const expenses = await Expense.findAll({ where: expenseWhere });
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amountLKR, 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amountLKR, 0);
    const profitMargin = totalExpense ? ((totalIncome - totalExpense) / totalExpense * 100).toFixed(2) : 0;
    res.json({ summary: { totalIncome, totalExpense, profitMargin } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBatchPerformance = async (req, res) => {
  const { batchId, startDate, endDate } = req.query;
  try {
    const batch = await AnimalBatch.findByPk(batchId);
    if (!batch) return res.status(404).json({ msg: 'Batch not found' });
    const where = {};
    if (startDate && endDate) {
      where.eventDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const events = await LifeEvent.findAll({ where });
    const mortalityCount = events.filter(e => e.eventType === 'deceased').length;
    const mortalityRate = batch.count ? (mortalityCount / batch.count * 100).toFixed(2) : 0;
    res.json({ summary: { mortalityRate, mortalityCount } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getEggProductionTrends = async (req, res) => {
  const { batchId, startDate, endDate } = req.query;
  try {
    const where = batchId ? { batchId } : {};
    if (startDate && endDate) {
      where.logDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const logs = await EggProductionLog.findAll({ where, include: [AnimalBatch], order: [['logDate', 'ASC']] });
    const totalEggs = logs.reduce((sum, log) => sum + log.eggCount, 0);
    const avgDaily = logs.length ? (totalEggs / logs.length).toFixed(2) : 0;
    // Trends for graphs
    const weeklyTotals = [];  // Aggregate weekly for charts
    let weekSum = 0;
    logs.forEach((log, index) => {
      weekSum += log.eggCount;
      if ((index + 1) % 7 === 0 || index === logs.length - 1) {
        weeklyTotals.push(weekSum);
        weekSum = 0;
      }
    });
    res.json({ logs, summary: { totalEggs, avgDaily, weeklyTotals } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeedEfficiency = async (req, res) => {
  const { batchId, startDate, endDate } = req.query;
  try {
    const where = batchId ? { batchId } : {};
    if (startDate && endDate) {
      where.logDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const feedLogs = await FeedConsumptionLog.findAll({ where });
    const eggLogs = await EggProductionLog.findAll({ where });
    const totalFeedKg = feedLogs.reduce((sum, log) => sum + log.feedAmountKg, 0);
    const totalEggs = eggLogs.reduce((sum, log) => sum + log.eggCount, 0);
    const fcr = totalEggs ? (totalFeedKg / totalEggs).toFixed(2) : 0;  // Feed per egg (adjust for weight if needed)
    const breakdown = {};  // Per type
    feedLogs.forEach(log => {
      breakdown[log.feedTypeId] = (breakdown[log.feedTypeId] || 0) + log.feedAmountKg;
    });
    res.json({ feedLogs, summary: { totalFeedKg, fcr, breakdown } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFinancialSummary = async (req, res) => {
  const { batchId, startDate, endDate } = req.query;
  try {
    const where = batchId ? { batchId } : {};
    if (startDate && endDate) {
      where.incomeDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const incomes = await Income.findAll({ where });
    const expensesWhere = { ...where };  // Adjust for expenseDate
    if (startDate && endDate) delete expensesWhere.incomeDate;  // Use expenseDate
    expensesWhere.expenseDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    const expenses = await Expense.findAll({ where: expensesWhere });
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amountLKR, 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amountLKR, 0);
    const profitMargin = totalExpense ? ((totalIncome - totalExpense) / totalExpense * 100).toFixed(2) : 0;
    res.json({ incomes, expenses, summary: { totalIncome, totalExpense, profitMargin } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBatchPerformance = async (req, res) => {
  const { batchId, startDate, endDate } = req.query;
  try {
    const batch = await AnimalBatch.findByPk(batchId);
    if (!batch) return res.status(404).json({ msg: 'Batch not found' });
    const where = { chickenId: { [Op.gt]: 0 } };  // Example for chickens; adjust for quails/ducks
    if (startDate && endDate) {
      where.eventDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const events = await LifeEvent.findAll({ where });
    const mortalityCount = events.filter(e => e.eventType === 'deceased').length;
    const mortalityRate = batch.count ? (mortalityCount / batch.count * 100).toFixed(2) : 0;
    // Other KPIs (e.g., FCR from feed efficiency)
    res.json({ batch, summary: { mortalityRate, mortalityCount } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};