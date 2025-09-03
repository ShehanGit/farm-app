const { FeedType } = require('../models');

exports.getFeedTypes = async (req, res) => {
  try {
    const types = await FeedType.findAll();
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFeedType = async (req, res) => {
  try {
    const type = await FeedType.create(req.body);
    res.status(201).json(type);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFeedType = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await FeedType.update(req.body, { where: { id } });
    if (updated) {
      const updatedType = await FeedType.findByPk(id);
      res.json(updatedType);
    } else {
      res.status(404).json({ msg: 'Feed type not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFeedType = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await FeedType.destroy({ where: { id } });
    if (deleted) {
      res.json({ msg: 'Feed type deleted' });
    } else {
      res.status(404).json({ msg: 'Feed type not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};