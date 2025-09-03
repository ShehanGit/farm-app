const sequelize = require('../config/db');
const Animal = require('./Animal');
const Crop = require('./Crop');
const Inventory = require('./Inventory');
const Log = require('./Log');
const User = require('./User');
const EggHatching = require('./EggHatching');
const AnimalBatch = require('./AnimalBatch');
const Chicken = require('./Chicken');
const Quail = require('./Quail');
const Duck = require('./Duck');
const Vaccination = require('./Vaccination');
const Breed = require('./Breed');
const LifeEvent = require('./LifeEvent');
const WeightRecord = require('./WeightRecord');
const EggProductionLog = require('./EggProductionLog');  // New
const FeedConsumptionLog = require('./FeedConsumptionLog');  // New

// Associations
Animal.hasMany(AnimalBatch, { foreignKey: 'animalId' });
AnimalBatch.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(EggHatching, { foreignKey: 'animalId' });
EggHatching.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(Vaccination, { foreignKey: 'animalId' });
Vaccination.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(Chicken, { foreignKey: 'animalId' });
Chicken.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(Quail, { foreignKey: 'animalId' });
Quail.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(Duck, { foreignKey: 'animalId' });
Duck.belongsTo(Animal, { foreignKey: 'animalId' });

Chicken.belongsTo(Breed, { foreignKey: 'breedId' });
Breed.hasMany(Chicken, { foreignKey: 'breedId' });

Chicken.hasMany(LifeEvent, { foreignKey: 'chickenId' });
LifeEvent.belongsTo(Chicken, { foreignKey: 'chickenId' });

Chicken.hasMany(WeightRecord, { foreignKey: 'chickenId' });
WeightRecord.belongsTo(Chicken, { foreignKey: 'chickenId' });

// Batch Lineage
Chicken.belongsTo(AnimalBatch, { as: 'ParentBatch', foreignKey: 'parentBatchId' });
AnimalBatch.hasMany(Chicken, { as: 'ChildrenChickens', foreignKey: 'parentBatchId' });

// New Batch Connections for Separation/Practical Tracking
AnimalBatch.hasMany(EggProductionLog, { foreignKey: 'batchId' });
EggProductionLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(FeedConsumptionLog, { foreignKey: 'batchId' });
FeedConsumptionLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Chicken, { foreignKey: 'batchId' });  // New: Chickens belong to batches for separation
Chicken.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  Animal,
  Crop,
  Inventory,
  Log,
  User,
  EggHatching,
  AnimalBatch,
  Chicken,
  Quail,
  Duck,
  Vaccination,
  Breed,
  LifeEvent,
  WeightRecord,
  EggProductionLog,  // New
  FeedConsumptionLog  // New
};