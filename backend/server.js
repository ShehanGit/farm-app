const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const { syncDatabase } = require('./models');  // Auto-sync tables

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const animalRoutes = require('./routes/animalRoutes');
const cropRoutes = require('./routes/cropRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const logRoutes = require('./routes/logRoutes');
const eggHatchingRoutes = require('./routes/eggHatchingRoutes');
const animalBatchRoutes = require('./routes/animalBatchRoutes');
const chickenRoutes = require('./routes/chickenRoutes');
const quailRoutes = require('./routes/quailRoutes');
const duckRoutes = require('./routes/duckRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');
const breedRoutes = require('./routes/breedRoutes');
const lifeEventRoutes = require('./routes/lifeEventRoutes');
const weightRecordRoutes = require('./routes/weightRecordRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/egg-hatchings', eggHatchingRoutes);
app.use('/api/animal-batches', animalBatchRoutes);
app.use('/api/chickens', chickenRoutes);
app.use('/api/quails', quailRoutes);
app.use('/api/ducks', duckRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/breeds', breedRoutes);
app.use('/api/life-events', lifeEventRoutes);
app.use('/api/weight-records', weightRecordRoutes);

// Sync DB and start server
const PORT = process.env.PORT || 5000;
syncDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});