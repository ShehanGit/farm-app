const { Log } = require('../models');

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addLog = async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};