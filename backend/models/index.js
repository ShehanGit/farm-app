const sequelize = require('../config/db');
const Animal = require('./Animal');
const Crop = require('./Crop');
const Inventory = require('./Inventory');
const Log = require('./Log');
const User = require('./User');
const EggHatching = require('./EggHatching');  // Keep only this one
const AnimalBatch = require('./AnimalBatch');
const Chicken = require('./Chicken');
const Quail = require('./Quail');
const Duck = require('./Duck');
const Vaccination = require('./Vaccination');
const Breed = require('./Breed');
const LifeEvent = require('./LifeEvent');
const WeightRecord = require('./WeightRecord');
const EggProductionLog = require('./EggProductionLog');
const FeedConsumptionLog = require('./FeedConsumptionLog');
const BatchVaccination = require('./BatchVaccination');
const SupplementLog = require('./SupplementLog');
const Expense = require('./Expense');
const Income = require('./Income');
const LegRing = require('./LegRing');
const BiosecurityLog = require('./BiosecurityLog');
const Incubator = require('./Incubator');
const FeedType = require('./FeedType');
const Harvest = require('./Harvest');
const Sale = require('./Sale');

// Associations
Animal.hasMany(AnimalBatch, { foreignKey: 'animalId', onDelete: 'CASCADE' });
AnimalBatch.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(EggHatching, { foreignKey: 'animalId', onDelete: 'CASCADE' });
EggHatching.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(Vaccination, { foreignKey: 'animalId', onDelete: 'CASCADE' });
Vaccination.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(Chicken, { foreignKey: 'animalId', onDelete: 'CASCADE' });
Chicken.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(Quail, { foreignKey: 'animalId', onDelete: 'CASCADE' });
Quail.belongsTo(Animal, { foreignKey: 'animalId' });

Animal.hasMany(Duck, { foreignKey: 'animalId', onDelete: 'CASCADE' });
Duck.belongsTo(Animal, { foreignKey: 'animalId' });

Chicken.belongsTo(Breed, { foreignKey: 'breedId', onDelete: 'CASCADE' });
Breed.hasMany(Chicken, { foreignKey: 'breedId' });

Quail.belongsTo(Breed, { foreignKey: 'breedId', onDelete: 'CASCADE' });
Breed.hasMany(Quail, { foreignKey: 'breedId' });

Duck.belongsTo(Breed, { foreignKey: 'breedId', onDelete: 'CASCADE' });
Breed.hasMany(Duck, { foreignKey: 'breedId' });

Chicken.hasMany(LifeEvent, { foreignKey: 'chickenId', onDelete: 'CASCADE' });
LifeEvent.belongsTo(Chicken, { foreignKey: 'chickenId' });

Quail.hasMany(LifeEvent, { foreignKey: 'quailId', onDelete: 'CASCADE' });
LifeEvent.belongsTo(Quail, { foreignKey: 'quailId' });

Duck.hasMany(LifeEvent, { foreignKey: 'duckId', onDelete: 'CASCADE' });
LifeEvent.belongsTo(Duck, { foreignKey: 'duckId' });

Chicken.hasMany(WeightRecord, { foreignKey: 'chickenId', onDelete: 'CASCADE' });
WeightRecord.belongsTo(Chicken, { foreignKey: 'chickenId' });

Quail.hasMany(WeightRecord, { foreignKey: 'quailId', onDelete: 'CASCADE' });
WeightRecord.belongsTo(Quail, { foreignKey: 'quailId' });

Duck.hasMany(WeightRecord, { foreignKey: 'duckId', onDelete: 'CASCADE' });
WeightRecord.belongsTo(Duck, { foreignKey: 'duckId' });

Chicken.belongsTo(AnimalBatch, { as: 'ParentBatch', foreignKey: 'parentBatchId' });
AnimalBatch.hasMany(Chicken, { as: 'ChildrenChickens', foreignKey: 'parentBatchId' });

Quail.belongsTo(AnimalBatch, { as: 'ParentBatch', foreignKey: 'parentBatchId' });
AnimalBatch.hasMany(Quail, { as: 'ChildrenQuails', foreignKey: 'parentBatchId' });

Duck.belongsTo(AnimalBatch, { as: 'ParentBatch', foreignKey: 'parentBatchId' });
AnimalBatch.hasMany(Duck, { as: 'ChildrenDucks', foreignKey: 'parentBatchId' });

AnimalBatch.hasMany(EggProductionLog, { foreignKey: 'batchId', onDelete: 'CASCADE' });
EggProductionLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(FeedConsumptionLog, { foreignKey: 'batchId', onDelete: 'CASCADE' });
FeedConsumptionLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(BatchVaccination, { foreignKey: 'batchId', onDelete: 'CASCADE' });
BatchVaccination.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(SupplementLog, { foreignKey: 'batchId', onDelete: 'CASCADE' });
SupplementLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Expense, { foreignKey: 'batchId', onDelete: 'CASCADE' });
Expense.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Income, { foreignKey: 'batchId', onDelete: 'CASCADE' });
Income.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Chicken, { foreignKey: 'batchId', onDelete: 'CASCADE' });
Chicken.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Quail, { foreignKey: 'batchId', onDelete: 'CASCADE' });
Quail.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Duck, { foreignKey: 'batchId', onDelete: 'CASCADE' });
Duck.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(LegRing, { foreignKey: 'batchId', onDelete: 'CASCADE' });
LegRing.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(BiosecurityLog, { foreignKey: 'batchId', onDelete: 'CASCADE' });
BiosecurityLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

// Sync
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
  EggProductionLog,
  FeedConsumptionLog,
  BatchVaccination,
  SupplementLog,
  Expense,
  Income,
  LegRing,
  BiosecurityLog,
  Harvest,
  Sale
};