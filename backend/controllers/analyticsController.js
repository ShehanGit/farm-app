const { Crop, Expense, Harvest, Sale, Wastage, Stock } = require('../models');
const { Op } = require('sequelize');

exports.getProfitSummary = async (req, res) => {
  const { start, end } = req.query; // e.g., ?start=2025-01-01&end=2025-12-31
  const dateFilter = start && end ? {
    [Op.and]: [
      { date: { [Op.gte]: start } },
      { date: { [Op.lte]: end } }
    ]
  } : {};

  try {
    const crops = await Crop.findAll();
    const totalAcres = crops.reduce((sum, crop) => sum + crop.acre, 0);

    // Expenses (filtered)
    const expenses = await Expense.findAll({ where: dateFilter });
    const farmWideCosts = expenses.filter(e => !e.cropId).reduce((sum, e) => sum + e.amount, 0);
    const cropDirectCosts = {};
    expenses.filter(e => e.cropId).forEach(e => {
      cropDirectCosts[e.cropId] = (cropDirectCosts[e.cropId] || 0) + e.amount;
    });

    const cropTotalCosts = {};
    crops.forEach(crop => {
      const direct = cropDirectCosts[crop.id] || 0;
      const proportion = totalAcres > 0 ? crop.acre / totalAcres : 0;
      const allocated = farmWideCosts * proportion;
      cropTotalCosts[crop.id] = direct + allocated;
    });

    // Harvests (filtered by date)
    const harvests = await Harvest.findAll({ where: dateFilter });
    const cropHarvested = {};
    harvests.forEach(h => {
      cropHarvested[h.cropId] = (cropHarvested[h.cropId] || 0) + h.quantityKg;
    });

    // Wastages (filtered, aggregated per crop via harvest)
    const wastages = await Wastage.findAll({ where: dateFilter, include: ['Harvest'] });
    const cropWasted = {};
    wastages.forEach(w => {
      const cropId = w.Harvest ? w.Harvest.cropId : null;
      if (cropId) {
        cropWasted[cropId] = (cropWasted[cropId] || 0) + w.quantityKg;
      }
    });

    // Sales (filtered)
    const sales = await Sale.findAll({ where: dateFilter });
    const cropIncome = {};
    const cropSold = {};
    sales.forEach(s => {
      const income = s.quantityKg * s.pricePerKg;
      cropIncome[s.cropId] = (cropIncome[s.cropId] || 0) + income;
      cropSold[s.cropId] = (cropSold[s.cropId] || 0) + s.quantityKg;
    });

    // Stock Overrides
    const stocks = await Stock.findAll();
    const cropStockOverrides = {};
    stocks.forEach(s => {
      cropStockOverrides[s.cropId] = s.currentKg;
    });

    // Totals
    const totalFarmIncome = Object.values(cropIncome).reduce((sum, v) => sum + v, 0);
    const totalCropDirectCosts = Object.values(cropDirectCosts).reduce((sum, v) => sum + v, 0);
    const totalFarmCost = farmWideCosts + totalCropDirectCosts;
    const totalFarmProfit = totalFarmIncome - totalFarmCost;

    // Per-crop summary
    const summary = crops.map(crop => {
      const cost = cropTotalCosts[crop.id] || 0;
      const income = cropIncome[crop.id] || 0;
      const harvested = cropHarvested[crop.id] || 0;
      const sold = cropSold[crop.id] || 0;
      const wasted = cropWasted[crop.id] || 0;
      const calculatedStock = Math.max(0, harvested - sold - wasted);
      const currentStockKg = cropStockOverrides[crop.id] !== undefined ? cropStockOverrides[crop.id] : calculatedStock;
      const profit = income - cost;

      return {
        cropId: crop.id,
        crop: crop.type,
        acres: crop.acre,
        harvestedKg: harvested,
        soldKg: sold,
        wastedKg: wasted,
        currentStockKg,
        totalCostLKR: Math.round(cost),
        totalIncomeLKR: Math.round(income),
        netProfitLKR: Math.round(profit),
        profitPerAcreLKR: crop.acre ? Math.round(profit / crop.acre) : 0,
        costPerKgSoldLKR: sold ? Math.round(cost / sold) : null,
        profitPerKgSoldLKR: sold ? Math.round(profit / sold) : null,
        averageSalePricePerKg: sold ? Math.round(income / sold) : null
      };
    });

    const totalStockKg = summary.reduce((sum, item) => sum + item.currentStockKg, 0);
    const totalWastedKg = Object.values(cropWasted).reduce((sum, v) => sum + v, 0);

    res.json({
      summary,
      farmTotal: {
        totalIncomeLKR: Math.round(totalFarmIncome),
        totalCostLKR: Math.round(totalFarmCost),
        netProfitLKR: Math.round(totalFarmProfit),
        profitPerAcreLKR: totalAcres ? Math.round(totalFarmProfit / totalAcres) : 0,
        totalHarvestedKg: Object.values(cropHarvested).reduce((sum, v) => sum + v, 0),
        totalSoldKg: Object.values(cropSold).reduce((sum, v) => sum + v, 0),
        totalWastedKg,
        totalStockKg
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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