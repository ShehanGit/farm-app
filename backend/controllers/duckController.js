const { Duck, Breed, LifeEvent, AnimalBatch } = require('../models');

exports.getDucks = async (req, res) => {
  try {
    const ducks = await Duck.findAll({ include: [Breed, 'Animal', { model: AnimalBatch, as: 'ParentBatch' }] });
    res.json(ducks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addDuck = async (req, res) => {
  try {
    const duck = await Duck.create(req.body);
    // Auto-add hatch event
    await LifeEvent.create({ duckId: duck.id, eventType: 'hatched', eventDate: new Date() });
    res.status(201).json(duck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDuck = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Duck.update(req.body, { where: { id } });
    if (updated) {
      const updatedDuck = await Duck.findByPk(id, { include: [Breed, { model: AnimalBatch, as: 'ParentBatch' }] });
      // Auto-mark nonLaying if overdue
      const hatchEvent = await LifeEvent.findOne({ where: { duckId: id, eventType: 'hatched' } });
      if (hatchEvent) {
        const ageMonths = Math.round((new Date() - new Date(hatchEvent.eventDate)) / (1000 * 60 * 60 * 24 * 30));
        if (ageMonths > updatedDuck.Breed.productiveLayingPeriodMonths && updatedDuck.status === 'active' && updatedDuck.sex === 'female') {
          await updatedDuck.update({ status: 'nonLaying' });
          await LifeEvent.create({ duckId: id, eventType: 'markedNonLaying', eventDate: new Date(), details: 'Auto-marked due to age' });
        }
      }
      // If selling, add event
      if (req.body.status === 'sold') {
        await LifeEvent.create({ duckId: id, eventType: 'sold', eventDate: new Date() });
      }
      res.json(updatedDuck);
    } else {
      res.status(404).json({ msg: 'Duck not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDuck = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Duck.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Duck deleted' });
    } else {
      res.status(404).json({ msg: 'Duck not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLineage = async (req, res) => {  // Batch-based lineage with notes
  const { id } = req.params;
  const getTree = async (duckId, depth = 0, maxDepth = 5) => {
    if (depth > maxDepth) return null;
    const duck = await Duck.findByPk(duckId, { include: [{ model: AnimalBatch, as: 'ParentBatch' }, Breed] });
    if (!duck) return null;
    const data = duck.toJSON();
    data.children = await Duck.findAll({ where: { parentBatchId: duck.parentBatchId } });
    data.children = await Promise.all(data.children.map(c => getTree(c.id, depth + 1)));
    if (data.parentBatchId) {
      data.parentBatch = await AnimalBatch.findByPk(data.parentBatchId);
      data.parentNotes = duck.parentNotes;
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