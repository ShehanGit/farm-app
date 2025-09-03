const { Quail, Breed, LifeEvent, AnimalBatch } = require('../models');

exports.getQuails = async (req, res) => {
  try {
    const quails = await Quail.findAll({ include: [Breed, 'Animal', { model: AnimalBatch, as: 'ParentBatch' }] });
    res.json(quails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addQuail = async (req, res) => {
  try {
    const quail = await Quail.create(req.body);
    // Auto-add hatch event
    await LifeEvent.create({ quailId: quail.id, eventType: 'hatched', eventDate: new Date() });
    res.status(201).json(quail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuail = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Quail.update(req.body, { where: { id } });
    if (updated) {
      const updatedQuail = await Quail.findByPk(id, { include: [Breed, { model: AnimalBatch, as: 'ParentBatch' }] });
      // Auto-mark nonLaying if overdue (quail-specific, e.g., shorter period)
      const hatchEvent = await LifeEvent.findOne({ where: { quailId: id, eventType: 'hatched' } });
      if (hatchEvent) {
        const ageMonths = Math.round((new Date() - new Date(hatchEvent.eventDate)) / (1000 * 60 * 60 * 24 * 30));
        if (ageMonths > updatedQuail.Breed.productiveLayingPeriodMonths && updatedQuail.status === 'active' && updatedQuail.sex === 'female') {
          await updatedQuail.update({ status: 'nonLaying' });
          await LifeEvent.create({ quailId: id, eventType: 'markedNonLaying', eventDate: new Date(), details: 'Auto-marked due to age' });
        }
      }
      // If selling, add event
      if (req.body.status === 'sold') {
        await LifeEvent.create({ quailId: id, eventType: 'sold', eventDate: new Date() });
      }
      res.json(updatedQuail);
    } else {
      res.status(404).json({ msg: 'Quail not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuail = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Quail.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Quail deleted' });
    } else {
      res.status(404).json({ msg: 'Quail not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLineage = async (req, res) => {  // Batch-based lineage with notes
  const { id } = req.params;
  const getTree = async (quailId, depth = 0, maxDepth = 5) => {
    if (depth > maxDepth) return null;
    const quail = await Quail.findByPk(quailId, { include: [{ model: AnimalBatch, as: 'ParentBatch' }, Breed] });
    if (!quail) return null;
    const data = quail.toJSON();
    data.children = await Quail.findAll({ where: { parentBatchId: quail.parentBatchId } });
    data.children = await Promise.all(data.children.map(c => getTree(c.id, depth + 1)));
    if (data.parentBatchId) {
      data.parentBatch = await AnimalBatch.findByPk(data.parentBatchId);
      data.parentNotes = quail.parentNotes;
    }
    return data;
  };
  try {
    const tree = await getTree(id);
    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};