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
const Breed = require('./Breed');  // New
const LifeEvent = require('./LifeEvent');  // New
const WeightRecord = require('./WeightRecord');  // New

// Associations
Animal.hasMany(AnimalBatch);
AnimalBatch.belongsTo(Animal);

Animal.hasMany(EggHatching);
EggHatching.belongsTo(Animal);

Animal.hasMany(Vaccination);
Vaccination.belongsTo(Animal);

Animal.hasMany(Chicken);
Chicken.belongsTo(Animal);

Animal.hasMany(Quail);
Quail.belongsTo(Animal);

Animal.hasMany(Duck);
Duck.belongsTo(Animal);

// New Associations
Chicken.belongsTo(Breed);
Breed.hasMany(Chicken);

Chicken.hasMany(LifeEvent);
LifeEvent.belongsTo(Chicken);

Chicken.hasMany(WeightRecord);
WeightRecord.belongsTo(Chicken);

// Lineage self-reference
Chicken.belongsTo(Chicken, { as: 'Parent', foreignKey: 'parentId' });
Chicken.hasMany(Chicken, { as: 'Children', foreignKey: 'parentId' });

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
  Breed,  // New
  LifeEvent,  // New
  WeightRecord  // New
};