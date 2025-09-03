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
const EggProductionLog = require('./EggProductionLog');
const FeedConsumptionLog = require('./FeedConsumptionLog');
const BatchVaccination = require('./BatchVaccination');  // New
const SupplementLog = require('./SupplementLog');  // New
const Expense = require('./Expense');  // New
const Income = require('./Income');  // New

// Associations (previous + new for batch connections)
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

Chicken.belongsTo(AnimalBatch, { as: 'ParentBatch', foreignKey: 'parentBatchId' });
AnimalBatch.hasMany(Chicken, { as: 'ChildrenChickens', foreignKey: 'parentBatchId' });

// New for improved batch features/separation
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
  Income
};