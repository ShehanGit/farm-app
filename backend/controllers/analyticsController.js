const { Crop, Expense, Harvest, Sale, Wastage, Stock, 
        EggProductionLog, FeedConsumptionLog, Income, AnimalBatch, LifeEvent } = require('../models');
const { Op } = require('sequelize');

// ==================== CROP ANALYTICS ====================

exports.getProfitSummary = async (req, res) => {
  const { start, end } = req.query;
  
  // Build date filter for expenses, harvests, sales, wastages
  const dateFilter = {};
  if (start && end) {
    dateFilter.date = {
      [Op.between]: [start, end]
    };
  }

  try {
    const crops = await Crop.findAll();
    if (!crops || crops.length === 0) {
      return res.json({
        summary: [],
        farmTotal: {
          totalIncomeLKR: 0,
          totalCostLKR: 0,
          netProfitLKR: 0,
          profitPerAcreLKR: 0,
          totalHarvestedKg: 0,
          totalSoldKg: 0,
          totalWastedKg: 0,
          totalStockKg: 0
        }
      });
    }

    const totalAcres = crops.reduce((sum, crop) => sum + (crop.acre || 0), 0);

    // Get all expenses with date filter
    const expenses = await Expense.findAll({ where: dateFilter });
    
    // Separate farm-wide and crop-specific expenses
    const farmWideCosts = expenses
      .filter(e => !e.cropId)
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    
    const cropDirectCosts = {};
    expenses
      .filter(e => e.cropId)
      .forEach(e => {
        cropDirectCosts[e.cropId] = (cropDirectCosts[e.cropId] || 0) + (e.amount || 0);
      });

    // Allocate farm-wide costs proportionally to each crop
    const cropTotalCosts = {};
    crops.forEach(crop => {
      const direct = cropDirectCosts[crop.id] || 0;
      const proportion = totalAcres > 0 ? (crop.acre || 0) / totalAcres : 0;
      const allocated = farmWideCosts * proportion;
      cropTotalCosts[crop.id] = direct + allocated;
    });

    // Get harvests with date filter
    const harvests = await Harvest.findAll({ where: dateFilter });
    const cropHarvested = {};
    harvests.forEach(h => {
      cropHarvested[h.cropId] = (cropHarvested[h.cropId] || 0) + (h.quantityKg || 0);
    });

    // Get wastages with date filter
    const wastages = await Wastage.findAll({ 
      where: dateFilter,
      include: [{ model: Harvest, as: 'Harvest' }]
    });
    const cropWasted = {};
    wastages.forEach(w => {
      if (w.Harvest && w.Harvest.cropId) {
        cropWasted[w.Harvest.cropId] = (cropWasted[w.Harvest.cropId] || 0) + (w.quantityKg || 0);
      }
    });

    // Get sales with date filter
    const sales = await Sale.findAll({ where: dateFilter });
    const cropIncome = {};
    const cropSold = {};
    sales.forEach(s => {
      const income = (s.quantityKg || 0) * (s.pricePerKg || 0);
      cropIncome[s.cropId] = (cropIncome[s.cropId] || 0) + income;
      cropSold[s.cropId] = (cropSold[s.cropId] || 0) + (s.quantityKg || 0);
    });

    // Get current stock overrides
    const stocks = await Stock.findAll();
    const cropStockOverrides = {};
    stocks.forEach(s => {
      cropStockOverrides[s.cropId] = s.currentKg;
    });

    // Calculate totals
    const totalFarmIncome = Object.values(cropIncome).reduce((sum, v) => sum + v, 0);
    const totalCropDirectCosts = Object.values(cropDirectCosts).reduce((sum, v) => sum + v, 0);
    const totalFarmCost = farmWideCosts + totalCropDirectCosts;
    const totalFarmProfit = totalFarmIncome - totalFarmCost;

    // Build per-crop summary
    const summary = crops.map(crop => {
      const cost = cropTotalCosts[crop.id] || 0;
      const income = cropIncome[crop.id] || 0;
      const harvested = cropHarvested[crop.id] || 0;
      const sold = cropSold[crop.id] || 0;
      const wasted = cropWasted[crop.id] || 0;
      const calculatedStock = Math.max(0, harvested - sold - wasted);
      const currentStockKg = cropStockOverrides[crop.id] !== undefined 
        ? cropStockOverrides[crop.id] 
        : calculatedStock;
      const profit = income - cost;

      return {
        cropId: crop.id,
        crop: crop.type,
        acres: crop.acre,
        harvestedKg: Math.round(harvested),
        soldKg: Math.round(sold),
        wastedKg: Math.round(wasted),
        currentStockKg: Math.round(currentStockKg),
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
    const totalHarvestedKg = Object.values(cropHarvested).reduce((sum, v) => sum + v, 0);
    const totalSoldKg = Object.values(cropSold).reduce((sum, v) => sum + v, 0);
    const totalWastedKg = Object.values(cropWasted).reduce((sum, v) => sum + v, 0);

    res.json({
      summary,
      farmTotal: {
        totalIncomeLKR: Math.round(totalFarmIncome),
        totalCostLKR: Math.round(totalFarmCost),
        netProfitLKR: Math.round(totalFarmProfit),
        profitPerAcreLKR: totalAcres ? Math.round(totalFarmProfit / totalAcres) : 0,
        totalHarvestedKg: Math.round(totalHarvestedKg),
        totalSoldKg: Math.round(totalSoldKg),
        totalWastedKg: Math.round(totalWastedKg),
        totalStockKg: Math.round(totalStockKg)
      }
    });
  } catch (err) {
    console.error('Error in getProfitSummary:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCropTimeSeries = async (req, res) => {
  const { id } = req.params;
  const { start, end } = req.query;

  try {
    const crop = await Crop.findByPk(id);
    if (!crop) return res.status(404).json({ msg: 'Crop not found' });

    // Build date filter
    const dateFilter = {};
    if (start && end) {
      dateFilter.date = {
        [Op.between]: [start, end]
      };
    }

    // Fetch crop-specific data with date filter
    const [expenses, harvests, sales, wastages, farmExpenses, allCrops] = await Promise.all([
      Expense.findAll({ 
        where: { cropId: id, ...dateFilter },
        order: [['date', 'ASC']]
      }),
      Harvest.findAll({ 
        where: { cropId: id, ...dateFilter },
        order: [['date', 'ASC']]
      }),
      Sale.findAll({ 
        where: { cropId: id, ...dateFilter },
        order: [['date', 'ASC']]
      }),
      Wastage.findAll({
        include: [{ 
          model: Harvest, 
          as: 'Harvest',
          where: { cropId: id }
        }],
        where: dateFilter,
        order: [['date', 'ASC']]
      }),
      Expense.findAll({
        where: { cropId: null, ...dateFilter },
        order: [['date', 'ASC']]
      }),
      Crop.findAll()
    ]);

    // Calculate proportion for farm-wide expense allocation
    const totalAcres = allCrops.reduce((sum, c) => sum + (c.acre || 0), 0);
    const proportion = totalAcres > 0 ? (crop.acre || 0) / totalAcres : 0;

    // Aggregate data by month
    const monthlyData = {};

    // Process direct expenses
    expenses.forEach(e => {
      const month = e.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = {
          expenses: 0,
          harvests: 0,
          sales: 0,
          salesValue: 0,
          wastage: 0,
          expenseBreakdown: {}
        };
      }
      monthlyData[month].expenses += e.amount || 0;
      
      // Track expense categories
      const category = e.category || 'Other';
      monthlyData[month].expenseBreakdown[category] = 
        (monthlyData[month].expenseBreakdown[category] || 0) + (e.amount || 0);
    });

    // Allocate farm-wide expenses proportionally
    farmExpenses.forEach(e => {
      const month = e.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = {
          expenses: 0,
          harvests: 0,
          sales: 0,
          salesValue: 0,
          wastage: 0,
          expenseBreakdown: {}
        };
      }
      const allocated = (e.amount || 0) * proportion;
      monthlyData[month].expenses += allocated;
      
      const category = e.category || 'Other';
      monthlyData[month].expenseBreakdown[category] = 
        (monthlyData[month].expenseBreakdown[category] || 0) + allocated;
    });

    // Process harvests
    harvests.forEach(h => {
      const month = h.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = {
          expenses: 0,
          harvests: 0,
          sales: 0,
          salesValue: 0,
          wastage: 0,
          expenseBreakdown: {}
        };
      }
      monthlyData[month].harvests += h.quantityKg || 0;
    });

    // Process sales
    sales.forEach(s => {
      const month = s.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = {
          expenses: 0,
          harvests: 0,
          sales: 0,
          salesValue: 0,
          wastage: 0,
          expenseBreakdown: {}
        };
      }
      monthlyData[month].sales += s.quantityKg || 0;
      monthlyData[month].salesValue += (s.quantityKg || 0) * (s.pricePerKg || 0);
    });

    // Process wastages
    wastages.forEach(w => {
      const month = w.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = {
          expenses: 0,
          harvests: 0,
          sales: 0,
          salesValue: 0,
          wastage: 0,
          expenseBreakdown: {}
        };
      }
      monthlyData[month].wastage += w.quantityKg || 0;
    });

    // Convert to sorted arrays
    const sortedMonths = Object.keys(monthlyData).sort();
    
    if (sortedMonths.length === 0) {
      return res.json({
        labels: ['No data'],
        profit: [0],
        expenses: [0],
        harvests: [0],
        sales: [0],
        wastage: [0],
        avgPrices: [0],
        costBreakdown: { 'No expenses': 100 }
      });
    }

    const result = {
      labels: sortedMonths,
      profit: sortedMonths.map(m => Math.round(monthlyData[m].salesValue - monthlyData[m].expenses)),
      expenses: sortedMonths.map(m => Math.round(monthlyData[m].expenses)),
      harvests: sortedMonths.map(m => Math.round(monthlyData[m].harvests)),
      sales: sortedMonths.map(m => Math.round(monthlyData[m].sales)),
      wastage: sortedMonths.map(m => Math.round(monthlyData[m].wastage)),
      avgPrices: sortedMonths.map(m => 
        monthlyData[m].sales > 0 
          ? Math.round(monthlyData[m].salesValue / monthlyData[m].sales)
          : 0
      ),
      costBreakdown: {}
    };

    // Calculate overall cost breakdown
    const totalBreakdown = {};
    sortedMonths.forEach(m => {
      Object.entries(monthlyData[m].expenseBreakdown).forEach(([cat, amt]) => {
        totalBreakdown[cat] = (totalBreakdown[cat] || 0) + amt;
      });
    });

    const totalExpenses = Object.values(totalBreakdown).reduce((sum, v) => sum + v, 0);
    if (totalExpenses > 0) {
      Object.entries(totalBreakdown).forEach(([cat, amt]) => {
        result.costBreakdown[cat] = Math.round((amt / totalExpenses) * 100);
      });
    } else {
      result.costBreakdown = { 'No expenses': 100 };
    }

    res.json(result);
  } catch (err) {
    console.error('Error in getCropTimeSeries:', err);
    res.status(500).json({ error: err.message });
  }
};

// ==================== POULTRY ANALYTICS ====================

exports.getEggProductionTrends = async (req, res) => {
  const { batchId, startDate, endDate } = req.query;
  try {
    const where = batchId ? { batchId } : {};
    if (startDate && endDate) {
      where.logDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    const logs = await EggProductionLog.findAll({ 
      where, 
      include: [AnimalBatch], 
      order: [['logDate', 'ASC']] 
    });
    
    const totalEggs = logs.reduce((sum, log) => sum + (log.eggCount || 0), 0);
    const avgDaily = logs.length ? (totalEggs / logs.length).toFixed(2) : 0;
    
    // Aggregate weekly
    const weeklyTotals = [];
    let weekSum = 0;
    logs.forEach((log, index) => {
      weekSum += log.eggCount || 0;
      if ((index + 1) % 7 === 0 || index === logs.length - 1) {
        weeklyTotals.push(weekSum);
        weekSum = 0;
      }
    });
    
    res.json({ 
      logs, 
      summary: { totalEggs, avgDaily, weeklyTotals } 
    });
  } catch (err) {
    console.error('Error in getEggProductionTrends:', err);
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
    
    const totalFeedKg = feedLogs.reduce((sum, log) => sum + (log.feedAmountKg || 0), 0);
    const totalEggs = eggLogs.reduce((sum, log) => sum + (log.eggCount || 0), 0);
    const fcr = totalEggs ? (totalFeedKg / totalEggs).toFixed(2) : 0;
    
    res.json({ 
      summary: { totalFeedKg, totalEggs, fcr } 
    });
  } catch (err) {
    console.error('Error in getFeedConversionRatio:', err);
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
    
    const totalFeedKg = feedLogs.reduce((sum, log) => sum + (log.feedAmountKg || 0), 0);
    const totalEggs = eggLogs.reduce((sum, log) => sum + (log.eggCount || 0), 0);
    const fcr = totalEggs ? (totalFeedKg / totalEggs).toFixed(2) : 0;
    
    const breakdown = {};
    feedLogs.forEach(log => {
      breakdown[log.feedTypeId] = (breakdown[log.feedTypeId] || 0) + (log.feedAmountKg || 0);
    });
    
    res.json({ 
      feedLogs, 
      summary: { totalFeedKg, fcr, breakdown } 
    });
  } catch (err) {
    console.error('Error in getFeedEfficiency:', err);
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
    
    const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amountLKR || 0), 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + (exp.amountLKR || exp.amount || 0), 0);
    const profitMargin = totalExpense ? ((totalIncome - totalExpense) / totalExpense * 100).toFixed(2) : 0;
    
    res.json({ 
      summary: { totalIncome, totalExpense, profitMargin } 
    });
  } catch (err) {
    console.error('Error in getCostVsIncome:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getFinancialSummary = async (req, res) => {
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
    
    const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amountLKR || 0), 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + (exp.amountLKR || exp.amount || 0), 0);
    const profitMargin = totalExpense ? ((totalIncome - totalExpense) / totalExpense * 100).toFixed(2) : 0;
    
    res.json({ 
      incomes, 
      expenses, 
      summary: { totalIncome, totalExpense, profitMargin } 
    });
  } catch (err) {
    console.error('Error in getFinancialSummary:', err);
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
    
    res.json({ 
      batch, 
      summary: { mortalityRate, mortalityCount } 
    });
  } catch (err) {
    console.error('Error in getBatchPerformance:', err);
    res.status(500).json({ error: err.message });
  }
};