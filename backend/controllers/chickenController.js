const { Chicken, Breed, LifeEvent, AnimalBatch } = require('../models');

exports.getChickens = async (req, res) => {
  try {
    const chickens = await Chicken.findAll({ include: [Breed, 'Animal', { model: AnimalBatch, as: 'ParentBatch' }] });
    res.json(chickens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addChicken = async (req, res) => {
  try {
    const chicken = await Chicken.create(req.body);
    // Auto-add hatch event
    await LifeEvent.create({ chickenId: chicken.id, eventType: 'hatched', eventDate: new Date() });
    res.status(201).json(chicken);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateChicken = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Chicken.update(req.body, { where: { id } });
    if (updated) {
      const updatedChicken = await Chicken.findByPk(id, { include: [Breed, { model: AnimalBatch, as: 'ParentBatch' }] });
      // Auto-mark nonLaying if overdue
      const hatchEvent = await LifeEvent.findOne({ where: { chickenId: id, eventType: 'hatched' } });
      if (hatchEvent) {
        const ageMonths = Math.round((new Date() - new Date(hatchEvent.eventDate)) / (1000 * 60 * 60 * 24 * 30));
        if (ageMonths > updatedChicken.Breed.productiveLayingPeriodMonths && updatedChicken.status === 'active' && updatedChicken.sex === 'female') {
          await updatedChicken.update({ status: 'nonLaying' });
          await LifeEvent.create({ chickenId: id, eventType: 'markedNonLaying', eventDate: new Date(), details: 'Auto-marked due to age' });
        }
      }
      // If selling, update status and add event
      if (req.body.status === 'sold') {
        await LifeEvent.create({ chickenId: id, eventType: 'sold', eventDate: new Date() });
      }
      res.json(updatedChicken);
    } else {
      res.status(404).json({ msg: 'Chicken not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteChicken = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Chicken.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Chicken deleted' });
    } else {
      res.status(404).json({ msg: 'Chicken not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLineage = async (req, res) => {  // Updated for batch-based lineage with notes
  const { id } = req.params;
  const getTree = async (chickenId, depth = 0, maxDepth = 5) => {
    if (depth > maxDepth) return null;
    const chicken = await Chicken.findByPk(chickenId, { include: [{ model: AnimalBatch, as: 'ParentBatch' }, Breed] });
    if (!chicken) return null;
    const data = chicken.toJSON();
    data.children = await Chicken.findAll({ where: { parentBatchId: chicken.parentBatchId } });  // Group by batch
    data.children = await Promise.all(data.children.map(c => getTree(c.id, depth + 1)));
    if (data.parentBatchId) {
      data.parentBatch = await AnimalBatch.findByPk(data.parentBatchId);
      data.parentNotes = chicken.parentNotes;  // Include notes about parents
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