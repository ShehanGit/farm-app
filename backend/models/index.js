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

// Associations (previous + new for Quail/Duck mirroring Chicken)
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

Quail.belongsTo(Breed, { foreignKey: 'breedId' });
Breed.hasMany(Quail, { foreignKey: 'breedId' });

Duck.belongsTo(Breed, { foreignKey: 'breedId' });
Breed.hasMany(Duck, { foreignKey: 'breedId' });

Chicken.hasMany(LifeEvent, { foreignKey: 'chickenId' });
LifeEvent.belongsTo(Chicken, { foreignKey: 'chickenId' });

Quail.hasMany(LifeEvent, { foreignKey: 'quailId' });
LifeEvent.belongsTo(Quail, { foreignKey: 'quailId' });

Duck.hasMany(LifeEvent, { foreignKey: 'duckId' });
LifeEvent.belongsTo(Duck, { foreignKey: 'duckId' });

Chicken.hasMany(WeightRecord, { foreignKey: 'chickenId' });
WeightRecord.belongsTo(Chicken, { foreignKey: 'chickenId' });

Quail.hasMany(WeightRecord, { foreignKey: 'quailId' });
WeightRecord.belongsTo(Quail, { foreignKey: 'quailId' });

Duck.hasMany(WeightRecord, { foreignKey: 'duckId' });
WeightRecord.belongsTo(Duck, { foreignKey: 'duckId' });

Chicken.belongsTo(AnimalBatch, { as: 'ParentBatch', foreignKey: 'parentBatchId' });
AnimalBatch.hasMany(Chicken, { as: 'ChildrenChickens', foreignKey: 'parentBatchId' });

Quail.belongsTo(AnimalBatch, { as: 'ParentBatch', foreignKey: 'parentBatchId' });
AnimalBatch.hasMany(Quail, { as: 'ChildrenQuails', foreignKey: 'parentBatchId' });

Duck.belongsTo(AnimalBatch, { as: 'ParentBatch', foreignKey: 'parentBatchId' });
AnimalBatch.hasMany(Duck, { as: 'ChildrenDucks', foreignKey: 'parentBatchId' });

EggHatching.belongsTo(Breed, { foreignKey: 'breedId' });
Breed.hasMany(EggHatching, { foreignKey: 'breedId' });

AnimalBatch.hasMany(EggProductionLog, { foreignKey: 'batchId' });
EggProductionLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(FeedConsumptionLog, { foreignKey: 'batchId' });
FeedConsumptionLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(BatchVaccination, { foreignKey: 'batchId' });
BatchVaccination.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(SupplementLog, { foreignKey: 'batchId' });
SupplementLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Expense, { foreignKey: 'batchId' });
Expense.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Income, { foreignKey: 'batchId' });
Income.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Chicken, { foreignKey: 'batchId' });
Chicken.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Quail, { foreignKey: 'batchId' });
Quail.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(Duck, { foreignKey: 'batchId' });
Duck.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(LegRing, { foreignKey: 'batchId' });
LegRing.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(BiosecurityLog, { foreignKey: 'batchId' });
BiosecurityLog.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

AnimalBatch.hasMany(EggHatching, { foreignKey: 'batchId' });
EggHatching.belongsTo(AnimalBatch, { foreignKey: 'batchId' });

EggHatching.belongsTo(Incubator, { foreignKey: 'incubatorId' });
Incubator.hasMany(EggHatching, { foreignKey: 'incubatorId' });

FeedType.hasMany(Inventory, { foreignKey: 'feedTypeId' });
Inventory.belongsTo(FeedType, { foreignKey: 'feedTypeId' });

FeedType.hasMany(FeedConsumptionLog, { foreignKey: 'feedTypeId' });
FeedConsumptionLog.belongsTo(FeedType, { foreignKey: 'feedTypeId' });

Inventory.hasMany(FeedConsumptionLog, { foreignKey: 'inventoryId' });
FeedConsumptionLog.belongsTo(Inventory, { foreignKey: 'inventoryId' });



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
  EggHatching,
  EggHatching,
  Incubator,
  FeedType  

};